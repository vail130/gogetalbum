package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"./app"
)

func main() {
	a := ""
	if len(os.Args) > 1 {
		a = strings.ToLower(os.Args[1])
	}

	if len(os.Args) < 3 || a == "help" || a == "-h" || a == "--help" {
		fmt.Print(`	gogetalbum

	Find and download mp3 tracks for an album. Adds Artist, Album, Title, and track numbers to ID3 tags of mp3s.

	Usage: gogetalbum "ARTIST" "ALBUM" [SAVE_PATH]

	ARTIST		The name of the artist or band who made the album. Use quotation marks for multiple words or special characters.
	ALBUM		The name of the release from the ARTIST. Use quotation marks for multiple words or special characters.
	SAVE_PATH	Directory in which a directory tree will be saved with the structure ARTIST/ALBUM/track.mp3. Defaults to /tmp.

	Examples:

		gogetalbum Incubus "Make Youself"
		gogetalbum "Foo Fighters" "In Your Honor" ~/Music

	Notes:

		Unique commands are (basically) idempotent, and will overwrite files in place.

`)
	} else {
		err := app.Start()
		if err != nil {
			log.Fatal(err.Error())
			os.Exit(1)
		}
	}
}
