package main

import (
	"log"
	"os"

	"./app"
)

func main() {
	err := app.Start()
	if err != nil {
		log.Fatal(err.Error())
		os.Exit(1)
	}
}
