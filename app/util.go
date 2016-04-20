package app

import (
	"compress/gzip"
	"io/ioutil"
	"math"
	"net/http"
	"strconv"
	"strings"
	"bytes"
)

func Concat(strings ...string) string {
	var buffer bytes.Buffer

	for _, str := range strings {
		buffer.WriteString(str)
	}

	return buffer.String()
}

func getResponseBodyFromUrl(url string, gzipDeflate bool) ([]byte, error) {
	client := &http.Client{}
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	request.Header.Add("Accept", "*/*")
	request.Header.Add("Accept-Encoding", "gzip, deflate, sdch")
	request.Header.Add("Accept-Language", "en-US,en;q=0.8")
	request.Header.Add("Accept-Location", "*")
	request.Header.Add("Cache-Control", "no-cache")
	request.Header.Add("Connection", "keep-alive")
	request.Header.Add("Host", "www.youtube-mp3.org")
	request.Header.Add("Pragma", "no-cache")
	request.Header.Add("Referer", "http://www.youtube-mp3.org/")
	request.Header.Add("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36")

	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	dataSource := response.Body

	if gzipDeflate {
		defer dataSource.Close()
		compressedData, err := gzip.NewReader(dataSource)
		if err != nil {
			return nil, err
		}

		dataSource = compressedData
	}

	defer dataSource.Close()
	data, err := ioutil.ReadAll(dataSource)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func fn(I []string, B string) int {
	for i, char := range I {
		if char == B {
			return i
		}
	}
	return -1
}

func signUrl(url string) string {
	A := map[string]int{"a": 870, "b": 906, "c": 167, "d": 119, "e": 130, "f": 899, "g": 248, "h": 123, "i": 627, "j": 706, "k": 694, "l": 421, "m": 214, "n": 561, "o": 819, "p": 925, "q": 857, "r": 539, "s": 898, "t": 866, "u": 433, "v": 299, "w": 137, "x": 285, "y": 613, "z": 635, "_": 638, "&": 639, "-": 880, "/": 687, "=": 721}
	r3 := []string{"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"}
	F := 1.51214
	N := 3219.0

	var Q string
	var ok bool

	for Y, _ := range url {
		Q = strings.ToLower(string(url[Y]))
		if fn(r3, Q) > -1 {
			tmp, _ := strconv.Atoi(Q)
			N = N + (float64(tmp) * 121.0 * F)
		} else {
			_, ok = A[Q]
			if ok {
				N = N + (float64(A[Q]) * F)
			}
		}
		N = N * 0.1
	}

	// Add 0.5 then floor is equivalent to rounding
	N = math.Floor((N * 1000.0) + 0.5)
	return strconv.Itoa(int(N))
}

func cc(a string) string {
	AM := 65521
	b := 1
	c := 0
	var d int

	for e := 0; e < len(a); e++ {
		d = int([]byte(a)[e])
		b = (b + d) % AM
		c = (c + b) % AM
	}
	return strconv.Itoa(c << 16 | b)
}
