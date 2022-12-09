package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func main() {
	port, exists := os.LookupEnv("PORT")
	if !exists {
		port = "3000"
	}

	fmt.Println(fmt.Sprintf("Listening on %s", port))
	http.HandleFunc("/", getCustomers)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), nil); err != nil {
		log.Fatal(err)
	}

}

func getCustomers(w http.ResponseWriter, r *http.Request) {
	logEntry := fmt.Sprintf("%s %s %s %s", r.RemoteAddr, r.Host, r.Method, r.RequestURI)
	log.Println(logEntry)
	b, err := ioutil.ReadFile("customers.json")
	if err != nil {
		panic("failed to read customers.json")
	}
	raw := json.RawMessage(string(b))
	var objMap []interface{}
	if err := json.Unmarshal(raw, &objMap); err != nil {
		panic("failed to unmarshal")
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode((objMap))
}
