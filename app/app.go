package app

import (
	"bytes"
	// "encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"strconv"
	// "strings"
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
	var trackPathBuffer bytes.Buffer

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
		data, err := app.Tracklist[i].Download()
		if err != nil {
			return err
		}

		trackPathBuffer.Reset()

		trackPathBuffer.WriteString(app.OutputDir)
		trackPathBuffer.WriteString("/")
		trackPathBuffer.WriteString(app.Artist)
		trackPathBuffer.WriteString("/")
		trackPathBuffer.WriteString(app.Album)

		err = os.MkdirAll(trackPathBuffer.String(), 0777)
		if err != nil {
			return err
		}

		trackPathBuffer.WriteString("/")
		trackPathBuffer.WriteString(app.Tracklist[i].Title)
		trackPathBuffer.WriteString(".mp3")

		err = ioutil.WriteFile(trackPathBuffer.String(), data, 0777)
		if err != nil {
			return err
		}

		return nil
	}

	return nil
}

func (track *Track) Download() ([]byte, error) {
	var urlBuffer bytes.Buffer
	// sourceUrlPieces := strings.Split(track.SourceUrl, "=")
	epoch := strconv.Itoa(int(time.Now().Unix()))

	// http://www.youtube-mp3.org/api/pushItem/?item=#{video_url}&xy=yx&bf=false&r=#{Time.now.to_i}
	urlBuffer.WriteString("http://www.youtube-mp3.org/a/pushItem/?item=")
	// urlBuffer.WriteString(url.QueryEscape(track.SourceUrl))
	urlBuffer.WriteString(track.SourceUrl)
	urlBuffer.WriteString("&el=na&bf=false&r=")
	urlBuffer.WriteString(epoch)

	signature := signUrl(urlBuffer.String())
	urlBuffer.WriteString("&s=")
	urlBuffer.WriteString(signature)

	fmt.Println("DOWNLOADING TRACK FROM:", urlBuffer.String())

	data, err := getResponseBodyFromUrl(urlBuffer.String())
	if err != nil {
		return nil, err
	}

	fmt.Println("DATA:", string(data[:len(data)]))

	// "http://www.youtube-mp3.org/get?ab=128&video_id="+video_id+"&h="+info.h+"&r="+timeNow+"."+cc(video_id+timeNow)
	// urlBuffer.Reset()
	// urlBuffer.WriteString("http://www.youtube-mp3.org/get?ab=128&video_id=")
	// urlBuffer.WriteString(sourceUrlPieces[len(sourceUrlPieces)-1])
	// urlBuffer.WriteString("&h=")
	// urlBuffer.WriteString()
	// urlBuffer.WriteString("&r=")
	// urlBuffer.WriteString()
	// urlBuffer.WriteString()

	return data, nil
}
