package app

import (
	"io/ioutil"
	"math"
	"net/http"
	"strconv"
	"strings"
)

func getResponseBodyFromUrl(url string) ([]byte, error) {
	client := &http.Client{}
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	request.Header.Add("Accept", "*/*")
	request.Header.Add("Accept-Encoding", "gzip, deflate")
	request.Header.Add("Accept-Language", "en-US,en;q=0.5")
	request.Header.Add("Accept-Location", "*")
	request.Header.Add("Cache-Control", "no-cache")
	request.Header.Add("Connection", "keep-alive")
	request.Header.Add("Cookie", "ux=abe39402-fe0f-11e3-ad4e-adc1d2df4a73|0|0|1403882901|1404314901|924c3631a6544bae4c7d14bb6c61838b; __utma=120311424.1287252735.1412343388.1412343388.1412343388.1; __utmz=120311424.1412343388.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); ux=abe39402-fe0f-11e3-ad4e-adc1d2df4a73|0|0|1415846498|1416278498|1507184932bddd240ee17f7a55c5215a")
	request.Header.Add("DNT", "1")
	request.Header.Add("Host", "www.youtube-mp3.org")
	request.Header.Add("Pragma", "no-cache")
	request.Header.Add("Referer", "http://www.youtube-mp3.org/")
	request.Header.Add("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")

	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()
	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	return data, err
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
	F := 1.23413
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

	N = math.Floor((N * 1000.0) + 0.5)
	return strconv.Itoa(int(N))
}
