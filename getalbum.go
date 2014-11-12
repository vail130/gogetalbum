package main

import (
	"./app"
	"log"
	"os"
)

func main() {
	err := app.Start()
	if err != nil {
		log.Fatal(err.Error())
		os.Exit(1)
	}
}
