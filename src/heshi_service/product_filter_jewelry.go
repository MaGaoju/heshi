package main

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"util"

	"github.com/gin-gonic/gin"
)

// ref - search by name and ID
func searchJewelrys() {
	// $sql='SELECT * FROM jewelry WHERE need_diamond = "'.$need_diamond.'" AND id = ? AND online = "YES"';
}

func filterJewelrys(c *gin.Context) ([]jewelry, error) {
	q, err := composeFilterJewelryQuery(c)
	if err != nil {
		return nil, err
	}
	rows, err := db.Query(q)
	if err != nil {
		return nil, err
	}
	js, err := composeJewelry(rows)
	if err != nil {
		return nil, err
	}
	return js, nil
}

// class:mounting or complete
// category:2
// size:
// material:
// price:
// mounting_type:
// sds:
// diashape:
// crrpage:
func composeFilterJewelryQuery(c *gin.Context) (string, error) {
	class := c.Query("class")
	var querys []string
	needDiamond := "NO"
	if class == "mounting" {
		needDiamond = "YES"
	}
	querys = append(querys, fmt.Sprintf("need_diamond='%s'", needDiamond))
	if c.PostForm("category") != "" {
		querys = append(querys, fmt.Sprintf("category='%s'", c.PostForm("category")))
	}
	if c.PostForm("material") != "" {
		querys = append(querys, fmt.Sprintf("material='%s'", c.PostForm("material")))
	}
	if c.PostForm("size") != "" {
		cValue, err := strconv.ParseFloat(c.PostForm("weight_from"), 64)
		if err != nil {
			return "", err
		}
		querys = append(querys, fmt.Sprintf("dia_size_min<=%f", math.Abs(cValue)))
		querys = append(querys, fmt.Sprintf("dia_size_max>='%f'", math.Abs(cValue)))
	}
	if c.PostForm("price") != "" {
		price, err := strconv.Atoi(c.PostForm("price"))
		if err != nil {
			return "", err
		}
		if price == 300 {
			querys = append(querys, fmt.Sprintf("price<=%d", price))
		} else if price == 1500 {
			querys = append(querys, fmt.Sprintf("price>=%d", price))
		} else {
			maxPrice := price + 300
			querys = append(querys, fmt.Sprintf("price<=%d AND price>=%d", maxPrice, price))
		}

		smallDias := "NO"
		if c.PostForm("sds") == "YES" {
			smallDias = "YES"
			querys = append(querys, fmt.Sprintf("small_dias='%s'", smallDias))
		}
	}

	if c.PostForm("mounting_type") != "" {
		querys = append(querys, fmt.Sprintf("mounting_type='%s'", c.PostForm("mounting_type")))
	}

	if c.PostForm("diashape") != "" {
		querys = append(querys, fmt.Sprintf("dia_shape LIKE '%s'", c.PostForm("diashape")))
	}

	var limit string
	currentPage := 1
	if c.PostForm("crr_page") != "" {
		var err error
		currentPage, err = strconv.Atoi(c.PostForm("crr_page"))
		if err != nil {
			return "", err
		}
		//32 records per page
		limit = fmt.Sprintf("LIMIT 32 OFFSET %d", util.AbsInt(currentPage-1)*32)
	}
	q := fmt.Sprintf(`SELECT id, stock_id, category, unit_number, dia_shape, material, metal_weight, need_diamond, name, name_suffix,
	 dia_size_min, dia_size_max, small_dias, small_dia_num, small_dia_carat, mounting_type, main_dia_num, main_dia_size, 
	 video_link, text, online, verified, in_stock, featured, price, stock_quantity, profitable,
	 totally_scanned, free_acc, last_scan_at,offline_at 
	 FROM jewelrys WHERE '(%s)' GROUP BY name ORDER BY online DESC, stock_quantity DESC, created_at DESC %s`,
		strings.Join(querys, ")' AND '("), limit)
	util.Println(q)
	return q, nil
}
