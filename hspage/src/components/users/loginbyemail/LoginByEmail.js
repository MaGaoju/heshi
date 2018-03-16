export default {
  name: 'Login',
  data: function (params) {
    return {
      login_feedback: '',
      upgrade_feedback: '',
      username: '',
      password: ''
    }
  },
  props: {
    _ref: String,
    _for: String,
    _account: String,
    loginResult: null
  },
  methods: {
    reference: function () {
      if (this.referer) {
        if (this.for) {
          if (this.for === 'appointment') {
            this.$http.headers.common['Location'] = 'appointment'
          } else {
            this.$http.headers.common['Location'] = 'myaccount'
          }
        } else {
          this.$http.headers.common['Location'] = 'myaccount'
        }
      }
    },
    login: function () {
      var formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)

      this.$http.post(
        this.$userURL + '/login',
        formData,
        {
          headers: {
              'X-Auth-Token': 'Jbm6XfXQj/KqmMTqz6c4GQWl9U6JMLQ/T4LzPWIEi2W2Q23GDkuIfxvbUC/rar8ZJIWWSVo68fZ/hv6n0oAeXaQKEfhKmGUZ8m8JHm5TteBZwqZuqXAbOeowTJVBn8aaUhfSfZbmgNnXwDEnhjZ1DZ8jG2Khy9uzoHu5ogwbVHQ=',
              'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
          if (response.status === 200) {
            // token
            console.log(response.body)
            this.loginResult = JSON.parse(response.body)
            this.cookies.set('_account', this.loginResult._account)
            this.cookies.set('hssessionid', this.loginResult.hs_sessionuserid)
            // this.$cookies.set('beyou', this.loginResult.id)
            // this.$cookies.set('token', this.loginResult.token)
          }
          return response.body
        }, err => { console.log(err); alert('error:' + err.body) })
    },
    logout: function () {
      this.$http.post(
        this.$userURL + '/logout'
      ).then(response => {
        console.log('logout')
        this.$route.router.go('/')
      }, err => { console.log(err); alert('error:' + err.body) })
    },
    getQRCode: function () {
      //MAX 1 - 4294967295
      var sceneID = Math.floor(Math.random() * 1000 * 1000 * 1000)
      this.$http.get(
        this.$wechatURL + '/temp_qrcode?sceneID=' + sceneID
      ).then(response => {
        return response.body
      }, err => { console.log(err); alert('error:' + err.body) })
    },
    returnPic: function () {
      return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGo8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyR3UtUEVDclFleGoxSWxDRnhxMTAAAgSd5alaAwR4AAAA'
    }
  }
}