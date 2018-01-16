package main

var jewelryHeaders = []string{
	"stock_id",
	"category",
	"name",
	"name_suffix",
	"material",
	"metal_weight",

	"need_diamond",
	"dia_shape",
	"main_dia_num",
	"main_dia_size",
	"dia_size_min",
	"dia_size_max",

	"small_dias",
	"small_dia_num",
	"small_dia_carat",
	"mounting_type",
	"unit_number",
}

//TODO ref
// <option value="JR">素金戒指</option>
// <option value="JE">素金耳环／耳钉</option>
// <option value="JP">素金吊坠／项链</option>
// <option value="ZR">镶碎钻戒指</option>
// <option value="ZE">镶碎钻耳环／耳钉</option>
// <option value="ZP">镶碎钻吊坠／项链</option>
// <option value="CR">成品戒指</option>
// <option value="CE">成品耳环／耳钉</option>
// <option value="CP">成品吊坠／项链</option>

// |  1 | pendant      | 吊坠          |                1 |
// |  2 | ring         | 戒指          |                1 |
// |  3 | earring      | 耳环&耳钉     |                2 |
// |  9 | bracelet     | 手链          |                1 |
// |  5 | necklace     | 项链          |                1 |
// | 10 | precious-gem | 彩宝          |                1 |

var VALID_CATEGORY = []int{
	1,
	2,
	3,
	5,
	9,
	10,
}

// Request URL:http://www.beyoudiamond.com/jewelry.php?class=mounting (kongtuo)
// Request URL:http://www.beyoudiamond.com/jewelry.php (chengpin)
// Request URL:http://www.beyoudiamond.com/colored-gems.php

var VALID_MATERIAL = []string{
	"PT",
	"ROSE_GOLD",
	"COLORED_GOLD",
	"UNKNOWN",
}

var VALID_MOUNTING_TYPE = []string{
	"3NODE",
	"4NODE",
	"6NODE",
	"SURROUND",
	"SPECIAL",
}

//dia_shape, should be array;
