import{a as c}from"./axios-L6U4YIEh.js";import{_ as u,c as l,a as i,b as t,w as r,d as o,F as _,r as n,o as p}from"./index-j3dd5ZXg.js";var h={VITE_APP_URL:"https://ec-course-api.hexschool.io/v2",VITE_APP_PATH:"aca101139",BASE_URL:"/TrSola/HexHWw6/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const m={data(){return{APIUrl:"https://ec-course-api.hexschool.io/v2",products:[],tempProduct:{}}},methods:{seeDetails(e){this.tempProduct=e},checkLogin(){const{VITE_APP_URL:e}=h;c.post(`${e}/api/user/check`).then(s=>console.log("驗證身分成功=>改為用toast")).catch(s=>{alert(s.response.data.message),this.$router.push("/")})}},mounted(){const e=document.cookie.replace(/(?:(?:^|.*;\s*)WillyToken\s*=\s*([^;]*).*$)|^.*$/,"$1");c.defaults.headers.common.Authorization=e,this.checkLogin()}},f=i("h2",null,"後台",-1);function P(e,s,k,V,x,R){const a=n("RouterLink"),d=n("RouterView");return p(),l(_,null,[f,i("nav",null,[t(a,{to:"/"},{default:r(()=>[o("回到前台")]),_:1}),o(" | "),t(a,{to:"/admin/order"},{default:r(()=>[o("order")]),_:1}),o(" | "),t(a,{to:"/admin/backProducts"},{default:r(()=>[o("backProducts")]),_:1}),o(" | ")]),t(d)],64)}const E=u(m,[["render",P]]);export{E as default};
