package app

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
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

type Album struct {
	Tracklist []Track
}

func Start() error {
	app := &App{
		Artist:    os.Args[1],
		Album:     os.Args[2],
		OutputDir: os.Args[3],
	}

	err := app.Run()
	if err != nil {
		return err
	}

	return nil
}

func (app *App) Run() error {
	err := app.GetTrackList()
	if err != nil {
		return err
	}

	log.Println("Track list", app.Tracklist)

	err = app.DownloadTracks()
	if err != nil {
		return err
	}

	log.Println("Tracks have been downloaded to", app.OutputDir)

	return nil
}

func (app *App) GetTrackList() error {
	var urlBuffer bytes.Buffer
	urlBuffer.WriteString("http://www.allmusic.com/search/albums/")
	urlBuffer.WriteString(url.QueryEscape(app.Artist))
	urlBuffer.WriteString("+")
	urlBuffer.WriteString(url.QueryEscape(app.Album))

	log.Println("Searching for album", urlBuffer.String())

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
		urlBuffer.WriteString("https://www.youtube.com/results?search_query=")
		urlBuffer.WriteString(url.QueryEscape(app.Artist))
		urlBuffer.WriteString("+")
		urlBuffer.WriteString(url.QueryEscape(app.Album))
		urlBuffer.WriteString("+")
		urlBuffer.WriteString(url.QueryEscape(app.Tracklist[i].Title))

		doc, err := goquery.NewDocument(urlBuffer.String())
		if err != nil {
			return err
		}

		resourcePath, _ := doc.Find("#results .yt-lockup-title > a").First().Attr("href")

		sourceUrlBuffer.Reset()
		sourceUrlBuffer.WriteString("https://www.youtube.com")
		sourceUrlBuffer.WriteString(resourcePath)

		app.Tracklist[i].SourceUrl = sourceUrlBuffer.String()

		waitGroup.Add(1)

		go func(app *App, track *Track, waitGroup *sync.WaitGroup) {
			data, err := track.Download()
			if err != nil {
				return
			}

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

			err = ioutil.WriteFile(trackBuffer.String(), data, 0777)
			if err != nil {
				return
			}

			trackBuffer.Reset()
			trackBuffer.WriteString("Downloading ")
			trackBuffer.WriteString(track.Title)
			trackBuffer.WriteString(" completed.")

			fmt.Println(trackBuffer.String())
			waitGroup.Done()
		}(app, &app.Tracklist[i], &waitGroup)
	}

	waitGroup.Wait()
	return nil
}

func (track *Track) Download() ([]byte, error) {
	var urlBuffer bytes.Buffer
	epoch := strconv.Itoa(int(time.Now().Unix()))

	// http://www.youtube-mp3.org/a/pushItem/?item=VIDEO_URL&el=na&bf=false&r=EPOCH&s=SIGNATURE
	urlBuffer.WriteString("http://www.youtube-mp3.org/a/pushItem/?item=")
	urlBuffer.WriteString(track.SourceUrl)
	urlBuffer.WriteString("&el=na&bf=false&r=")
	urlBuffer.WriteString(epoch)

	sig1 := signUrl(urlBuffer.String())
	urlBuffer.WriteString("&s=")
	urlBuffer.WriteString(sig1)

	fmt.Println("Requesting Track Conversion:", urlBuffer.String())

	videoIdBytes, err := getResponseBodyFromUrl(urlBuffer.String(), true)
	if err != nil {
		return nil, err
	}
	videoId := string(videoIdBytes)

	// http://www.youtube-mp3.org/api/itemInfo/?video_id=#{video_id}&ac=www&r=#{Time.now.to_i}
	urlBuffer.Reset()
	urlBuffer.WriteString("http://www.youtube-mp3.org/a/itemInfo/?video_id=")
	urlBuffer.WriteString(url.QueryEscape(videoId))
	urlBuffer.WriteString("&ac=www&t=grp&r=")
	urlBuffer.WriteString(epoch)

	sig2 := signUrl(urlBuffer.String())
	urlBuffer.WriteString("&s=")
	urlBuffer.WriteString(sig2)

	fmt.Println("Getting Track Hash:", urlBuffer.String())

	data, err := getResponseBodyFromUrl(urlBuffer.String(), true)
	if err != nil {
		return nil, err
	}

	re := regexp.MustCompile(`"h": *"(\w+)"`)
	videoHash := re.FindStringSubmatch(string(data))[1]

	fmt.Println("VIDEO HASH:", videoHash)

	// http://www.youtube-mp3.org/get?ab=128&video_id=xPf__WDYR_o&h=77aaa351474477724b9faf2e57d3cbdc&r=1415889212983.1594099374&s=86726
	urlBuffer.Reset()
	urlBuffer.WriteString("http://www.youtube-mp3.org/get?ab=128&video_id=")
	urlBuffer.WriteString(url.QueryEscape(videoId))
	urlBuffer.WriteString("&h=")
	urlBuffer.WriteString(videoHash)
	urlBuffer.WriteString("&r=")
	urlBuffer.WriteString(epoch)
	urlBuffer.WriteString(".")

	var stringBuffer bytes.Buffer
	stringBuffer.WriteString(videoId)
	stringBuffer.WriteString(epoch)
	urlBuffer.WriteString(cc(stringBuffer.String()))

	sig3 := signUrl(urlBuffer.String())
	urlBuffer.WriteString("&s=")
	urlBuffer.WriteString(sig3)

	fmt.Println("Downloading Track:", urlBuffer.String())

	data, err = getResponseBodyFromUrl(urlBuffer.String(), false)
	if err != nil {
		return nil, err
	}

	return data, nil
}
