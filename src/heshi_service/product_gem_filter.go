package main

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
)

//TODO search KEY: stock_id and certificate number???
func searchGems(c *gin.Context) ([]gem, error) {
	q := fmt.Sprintf(`SELECT id, stock_id, shape, material, size, name, text, images, certificate, 
	online, verified, in_stock, featured, price, stock_quantity, profitable,
	 totally_scanned, free_acc, last_scan_at,offline_at
		FROM gems WHERE stock_quantity > 0 AND stock_id='%s' OR certificate='%s'`,
		strings.ToUpper(c.PostForm("searchKey")), strings.ToUpper(c.PostForm("searchKey")))

	rows, err := dbQuery(q)
	if err != nil {
		return nil, err
	}
	gs, err := composeGem(rows)
	if err != nil {
		return nil, err
	}
	return gs, nil
}

func filterGems(c *gin.Context) ([]gem, error) {
	direction := "DESC"
	if c.PostForm("order") == "UP" {
		direction = "ASC"
	}
	q := fmt.Sprintf(`SELECT id, stock_id, shape, material, size, name, text, images, certificate, 
	online, verified, in_stock, featured, price, stock_quantity, profitable,
	 totally_scanned, free_acc, last_scan_at,offline_at
	  FROM gems WHERE stock_quantity > 0 ORDER BY price %s`, direction)

	rows, err := dbQuery(q)
	if err != nil {
		return nil, err
	}
	gs, err := composeGem(rows)
	if err != nil {
		return nil, err
	}
	return gs, nil
}
