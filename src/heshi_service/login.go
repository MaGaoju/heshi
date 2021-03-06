package main

import (
	"database/sql"
	"fmt"
	"heshi/errors"
	"net/http"
	"util"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type LoginUser struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	UserType string `json:"user_type"`
}

func userLogin(c *gin.Context) {
	loginUser := LoginUser{
		Username: c.PostForm("username"),
		Password: c.PostForm("password"),
		UserType: c.PostForm("user_type"),
	}

	q := fmt.Sprintf(`SELECT id, password, user_type, status FROM users where username='%s' or cellphone='%s' or email='%s'`,
		loginUser.Username, loginUser.Username, loginUser.Username)

	var id, password, userType, status string
	if err := dbQueryRow(q).Scan(&id, &password, &userType, &status); err != nil {
		if err == sql.ErrNoRows {
			vemsgLoginErrorUserName.Message = fmt.Sprintf("%s not exists", loginUser.Username)
			c.JSON(http.StatusOK, vemsgLoginErrorUserName)
			return
		}
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if status != "ACTIVE" {
		vemsgLoginErrorUserName.Message = fmt.Sprintf("%s is not an active user!", loginUser.Username)
		c.JSON(http.StatusOK, vemsgLoginErrorUserName)
		return
	}

	if loginUser.UserType != "" && loginUser.UserType != userType {
		c.JSON(http.StatusBadRequest, fmt.Sprintf("%s is not %s", loginUser.Username, loginUser.UserType))
		return
	}

	if !util.IsPassOK(loginUser.Password, password) {
		c.JSON(http.StatusOK, vemsgLoginErrorUserName)
		return
	}

	userProfile, err := getUserByID(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, errors.GetMessage(err))
		return
	}
	s := sessions.Default(c)
	s.Set(USER_SESSION_KEY, id)
	if userType == ADMIN {
		s.Set(ADMIN_KEY, id)
		c.SetCookie(ADMIN_KEY, id, 10, "/", "localhost", true, false)
	}
	c.SetCookie(USER_SESSION_KEY, id, 10, "/", "localhost", true, false)
	s.Save()
	c.JSON(http.StatusOK, gin.H{
		"code":        http.StatusOK,
		"token":       "faketoken",
		"userprofile": userProfile,
	})
}

func userLogout(c *gin.Context) {
	s := sessions.Default(c)
	s.Delete(USER_SESSION_KEY)
	s.Delete(ADMIN_KEY)
	s.Save()
	c.JSON(http.StatusOK, "User logout!")
}
