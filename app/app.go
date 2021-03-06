package app

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
	id3 "github.com/mikkyang/id3-go"
	"github.com/mikkyang/id3-go/v2"
)

type App struct {
	Artist    string
	Album     string
	Tracklist []Track
	OutputDir string
}

type Track struct {
	Title     string
	Position  int
	SourceUrl string
}

func Start() error {
	outputDir := ""
	if len(os.Args) > 3 {
		outputDir = os.Args[3]
	} else {
		outputDir = "/tmp"
	}

	app := &App{
		Artist:    os.Args[1],
		Album:     os.Args[2],
		OutputDir: outputDir,
	}

	err := app.Run()
	if err != nil {
		return err
	}

	return nil
}

func (app *App) Run() error {
	log.Println("Getting track list for", app.Artist, app.Album)

	err := app.GetTrackList()
	if err != nil {
		return err
	}

	log.Println("Found", len(app.Tracklist), "tracks. Downloading...")

	err = app.DownloadTracks()
	if err != nil {
		return err
	}

	log.Println("Tracks have been saved to", app.OutputDir)

	return nil
}

func (app *App) GetTrackList() error {
	var urlBuffer bytes.Buffer
	urlBuffer.WriteString("http://www.allmusic.com/search/albums/")
	urlBuffer.WriteString(url.QueryEscape(app.Artist))
	urlBuffer.WriteString("+")
	urlBuffer.WriteString(url.QueryEscape(app.Album))

	doc, err := goquery.NewDocument(urlBuffer.String())
	if err != nil {
		return err
	}

	albumUrl, _ := doc.Find(".search-results .album .title > a").First().Attr("href")

	doc, err = goquery.NewDocument(albumUrl)
	if err != nil {
		return err
	}

	trackNodes := doc.Find(".content .track-listing tr .title > a")

	trackList := make([]Track, trackNodes.Length())
	trackNodes.Each(func(i int, s *goquery.Selection) {
		trackList[i] = Track{
			Title:     s.Text(),
			Position:  i + 1,
			SourceUrl: "",
		}
	})

	app.Tracklist = trackList

	return nil
}

func (app *App) DownloadTracks() error {
	var urlBuffer bytes.Buffer
	var sourceUrlBuffer bytes.Buffer
	var waitGroup sync.WaitGroup

	for i, _ := range app.Tracklist {
		urlBuffer.Reset()
		urlBuffer.WriteString("https://www.youtube.com/results?filters=video&lclk=video&search_query=")
		urlBuffer.WriteString(url.QueryEscape(app.Artist))
		urlBuffer.WriteString("+")
		urlBuffer.WriteString(url.QueryEscape(app.Album))
		urlBuffer.WriteString("+")
		urlBuffer.WriteString(url.QueryEscape(app.Tracklist[i].Title))

		doc, err := goquery.NewDocument(urlBuffer.String())
		if err != nil {
			return err
		}

		bestResourcePath := ""
		backupResourcePath := ""

		doc.Find("#results .yt-lockup-title > a").Each(func(_ int, s *goquery.Selection) {
			if len(bestResourcePath) == 0 {
				resultTitle := strings.ToLower(s.Text())
				trackTitle := strings.ToLower(app.Tracklist[i].Title)

				if strings.Contains(resultTitle, trackTitle) && !strings.Contains(resultTitle, "full album") {
					bestResourcePath, _ = s.First().Attr("href")
				}
			}

			if len(backupResourcePath) == 0 {
				if !strings.Contains(strings.ToLower(s.Text()), "full album") {
					backupResourcePath, _ = s.First().Attr("href")
				}
			}
		})

		if len(bestResourcePath) == 0 {
			bestResourcePath = backupResourcePath
		}

		sourceUrlBuffer.Reset()
		sourceUrlBuffer.WriteString("https://www.youtube.com")
		sourceUrlBuffer.WriteString(bestResourcePath)

		app.Tracklist[i].SourceUrl = sourceUrlBuffer.String()

		fmt.Printf("Found track %s at https://www.youtube.com%s\n", app.Tracklist[i].Title, bestResourcePath)

		go DownloadTrack(app, &app.Tracklist[i], &waitGroup)
		waitGroup.Add(1)
	}
	waitGroup.Wait()
	return nil
}

func DownloadTrack(app *App, track *Track, waitGroup *sync.WaitGroup) {
	data, err := track.Download()
	if err != nil {
		return
	}

	fmt.Println("Saving", track.Title)

	var trackBuffer bytes.Buffer

	trackBuffer.WriteString(app.OutputDir)
	trackBuffer.WriteString("/")
	trackBuffer.WriteString(app.Artist)
	trackBuffer.WriteString("/")
	trackBuffer.WriteString(app.Album)

	err = os.MkdirAll(trackBuffer.String(), 0777)
	if err != nil {
		return
	}

	trackBuffer.WriteString("/")
	trackBuffer.WriteString(track.Title)
	trackBuffer.WriteString(".mp3")

	fullTrackPath := trackBuffer.String()

	err = ioutil.WriteFile(fullTrackPath, data, 0777)
	if err != nil {
		return
	}

	fmt.Println("Creating ID3 data for", track.Title)

	mp3File, err := id3.Open(fullTrackPath)
	if err != nil {
		mp3File.Close()
		return
	}

	mp3File.SetArtist(app.Artist)
	mp3File.SetAlbum(app.Album)
	mp3File.SetTitle(track.Title)

	textFrame := v2.NewTextFrame(v2.V23FrameTypeMap["TRCK"], strconv.Itoa(track.Position))
	mp3File.AddFrames(textFrame)

	mp3File.Close()

	f, err := id3.Open(fullTrackPath)
	defer f.Close()
	if err != nil {
		return
	}

	fmt.Println("ID3 info for", track.Title, "-", f.Artist(), f.Album(), f.Title())

	waitGroup.Done()
}

func getValueFromResponseForKey(track *Track, responseString string, key string) (string, error) {
	regexString := fmt.Sprintf(`"%s":"?([a-zA-Z0-9_=-]+)"?`, key)
	re := regexp.MustCompile(regexString)
	matches := re.FindStringSubmatch(responseString)

	if matches == nil || len(matches) < 2 {
		fmt.Println("ERROR: Could not find key", key, "for", track.Title, "from", track.SourceUrl, "in data: ", responseString)
		return "", errors.New("Missing response key")
	}

	return matches[1], nil
}

func (track *Track) Download() ([]byte, error) {
	var urlBuffer bytes.Buffer
	epoch := strconv.Itoa(int(time.Now().Unix()))

	// http://www.youtube-mp3.org/a/pushItem/?item=VIDEO_URL&el=na&bf=false&r=EPOCH&s=SIGNATURE
	urlBuffer.WriteString("/a/pushItem/?item=")
	urlBuffer.WriteString(url.QueryEscape(track.SourceUrl))
	urlBuffer.WriteString("&el=na&bf=false&r=")
	urlBuffer.WriteString(epoch)

	sig1 := signUrl(urlBuffer.String())
	urlBuffer.WriteString("&s=")
	urlBuffer.WriteString(sig1)

	videoIdBytes, err := getResponseBodyFromUrl(Concat("http://www.youtube-mp3.org", urlBuffer.String()), false)
	if err != nil {
		return nil, err
	}
	videoId := string(videoIdBytes)

	// http://www.youtube-mp3.org/api/itemInfo/?video_id=#{video_id}&ac=www&r=#{Time.now.to_i}
	urlBuffer.Reset()
	urlBuffer.WriteString("/a/itemInfo/?video_id=")
	urlBuffer.WriteString(url.QueryEscape(videoId))
	urlBuffer.WriteString("&ac=www&t=grp&r=")
	urlBuffer.WriteString(epoch)

	sig2 := signUrl(urlBuffer.String())
	urlBuffer.WriteString("&s=")
	urlBuffer.WriteString(sig2)

	data, err := getResponseBodyFromUrl(Concat("http://www.youtube-mp3.org", urlBuffer.String()), true)
	if err != nil {
		return nil, err
	}

	tsCreate, err := getValueFromResponseForKey(track, string(data), "ts_create")
	if err != nil {
		return nil, err
	}
	r, err := getValueFromResponseForKey(track, string(data), "r")
	if err != nil {
		return nil, err
	}
	videoHash, err := getValueFromResponseForKey(track, string(data), "h2")
	if err != nil {
		return nil, err
	}

	// http://www.youtube-mp3.org/get?video_id=KMU0tzLwhbE&ts_create=1434629063&r=MjYwNDoyMDAwOjZiNjI6MjAwOjQ0YzplMmM0OjgwMzA6OTk5OQ%3D%3D&h2=f415b428268972c53f73251b7a08d98b&s=153317

	urlBuffer.Reset()
	urlBuffer.WriteString("/get?video_id=")
	urlBuffer.WriteString(url.QueryEscape(videoId))
	urlBuffer.WriteString("&ts_create=")
	urlBuffer.WriteString(tsCreate)
	urlBuffer.WriteString("&r=")
	urlBuffer.WriteString(url.QueryEscape(r))
	urlBuffer.WriteString("&h2=")
	urlBuffer.WriteString(videoHash)

	sig3 := signUrl(urlBuffer.String())
	urlBuffer.WriteString("&s=")
	urlBuffer.WriteString(sig3)

	fmt.Println("Downloading", track.Title, "from", Concat("http://www.youtube-mp3.org", urlBuffer.String()))

	data, err = getResponseBodyFromUrl(Concat("http://www.youtube-mp3.org", urlBuffer.String()), false)
	if err != nil {
		return nil, err
	}

	return data, nil
}
