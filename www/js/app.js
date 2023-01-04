var $$ = Dom7;


var app = new Framework7({
  name: 'Dunia Resep', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element


  // App store
  store: store,
  // App routes
  routes: routes,
});
$$(document).on("page:afterin", function (e, page) {
  if (!localStorage.username) {
    page.router.navigate("/login");
  }
});

$$(document).on('page:init', function (e, page) {
  if (page.name == "login") {
    localStorage.removeItem("username");
    $$("#btnsignin").on('click', function () {
      app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/login.php", {
        "username": $$("#username").val(),
        "password": $$("#password").val()
      }, function (data) {
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == "success") {
          localStorage.username = $$('#username').val();
          page.router.back('/');
        } else {
          app.dialog.alert("Username atau Password salah");
        }
      });
    });
    $$('#btndaftar').on('click', function () {
      app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/register.php", {
        "nama": $$('#namadaftar').val(),
        "username": $$('#unamedaftar').val(),
        "password": $$('#pwddaftar').val()
      }, function (data) {
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == "success") {
          app.dialog.alert("Berhasil Mendaftarkan Akun!");
          page.router.navigate('/login');
        } else {
          app.dialog.alert("Gagal Mendaftarkan Akun!");
        }
      });
    });
  } else if (page.name == "resep") {
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/reseplist.php", {}, function (data) {
      var arr = JSON.parse(data);
      var resep = arr['data'];
      resep.forEach((t, index) => {
        $$("#resep").append("<div class='col-50'><div class='card'>" +
          "<div class='card-header'><a href='/detailresep/" + t.idresep + "'>" + t.nama + "</a></div><div class='card-content'>" +
          "<img src='" + t.foto + "' width='100%'>" + "</div></div></div>");
      });
    });

    $$('#btncari').on('click', function () {
      $$('#resep').html("");
      app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/cariresep.php", { "cari": $$('#txtcari').val() }, function (data) {
        var arr = JSON.parse(data);
        var resep = arr['data'];
        resep.forEach((t, index) => {
          $$("#resep").append("<div class='col-50'><div class='card'>" +
            "<div class='card-header'><a href='/detailresep/" + t.idresep + "'>" + t.nama + "</a></div><div class='card-content'>" +
            "<img src='" + t.foto + "' width='100%'>" + "</div></div></div>");
        });
      });
    });
  } else if (page.name == "detailresep") {
    var id = page.router.currentRoute.params.id;
    console.log(id);
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/detailresep.php", { "idresep": id }, function (data) {
      var arr = JSON.parse(data);
      var resep_api = arr['data'];
      $$('#namaResep').html(resep_api[0].nama);
      $$('#deskripsi').html(resep_api[0].deskripsi);
      $$('#urlFoto').append("<img src='" + resep_api[0].foto + "' width='100%'>");
      $$('#bahan').append("<p>" + resep_api[0].bahan + "</p>");
      $$('#langkah').append("<p>" + resep_api[0].langkah + "</p>");
    });
  } else if (page.name == "detailresepsaya") {
    var id = page.router.currentRoute.params.id;
    console.log(id);
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/detailresep.php", { "idresep": id }, function (data) {
      var arr = JSON.parse(data);
      var resep_api = arr['data'];
      $$('#namaResep').html(resep_api[0].nama);
      $$('#deskripsi').html(resep_api[0].deskripsi);
      $$('#urlFoto').append("<img src='" + resep_api[0].foto + "' width='100%'>");
      $$('#bahan').append("<p>" + resep_api[0].bahan + "</p>");
      $$('#langkah').append("<p>" + resep_api[0].langkah + "</p>");
      $$('#foot').append("<a class='button button-fill' href='/editresep/" + id + "'>EDIT</a><br>");
      $$('#foot').append("<a href='#' class='button button-fill' id='btndelete' >HAPUS</a>");
      $$('#btndelete').on('click', function () {
        app.request.post('http://ubaya.fun/hybrid/160419083/resep_api/hapusresep.php', {
          "idresep": id
        },
          function (data) {
            var arr = JSON.parse(data);
            var result = arr['result'];
            if (result == 'success') {
              app.dialog.alert('Resep Berhasil Dihapus!');
              app.view.main.router.navigate('/resep', { reloadCurrent: true, pushState: false });
            }
            else app.dialog.alert('Resep Gagal Dihapus!');
          });
      });
    });
  } else if (page.name == "kategori") {
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/kategori.php", {}, function (data) {
      var arr = JSON.parse(data);
      var resep = arr['data'];
      resep.forEach((t, index) => {
        $$('#kategori').append("<li><a href='/kategori_resep/" + t.idkategori + "'>" + t.nama + "</a></li>");
      });
    });
  } else if (page.name == "kategori_resep") {
    var id = page.router.currentRoute.params.id;
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/resep_kategori.php", { "idkategori": id }, function (data) {
      var arr = JSON.parse(data);
      var resep_api = arr['data'];
      $$('#titlekategori').html(resep_api[0].kategori);
      resep_api.forEach((t, index) => {
        $$("#kategori_resep").append("<div class='col-50'><div class='card'>" +
          "<div class='card-header'><a href='/detailresep/" + t.idresep + "'>" + t.nama + "</a></div><div class='card-content'>" +
          "<img src='" + t.foto + "' width='100%'>" + "</div></div></div>");
      });
    });
  } else if (page.name == "resepbaru") {
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/kategori.php", {}, function (data) {
      var arr = JSON.parse(data);
      var resep = arr['data'];
      resep.forEach((t, index) => {
        $$('#sel_kategori').append("<option value='" + t.idkategori + "'>" + t.nama + "</option>");
      });
    });
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/user.php", { "username": localStorage.username }, function (data) {
      var user = JSON.parse(data);
      localStorage.iduser = user['data'][0].iduser;
    });
    $$('#btnsubmit').on('click', function () {
      app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/tambahresep.php", {
        "nama": $$('#tx_nama').val(),
        "bahan": $$('#tx_bahan').val(),
        "langkah": $$('#tx_langkah').val(),
        "deskripsi": $$('#tx_deskripsi').val(),
        "foto": $$('#tx_foto').val(),
        "idkategori": $$('#sel_kategori :checked').val(),
        "iduser": localStorage.iduser
      }, function (data) {
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == 'success') {
          app.dialog.alert('Resep berhasil ditambahkan!');
          page.router.navigate("/");
        } else {
          app.dialog.alert('Resep gagal ditambahkan!');
        }
      });
    });
  } else if (page.name == "editresep") {
    var id = page.router.currentRoute.params.id;
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/detailresep.php", { "idresep": id }, function (data) {
      var arr = JSON.parse(data);
      var resep_api = arr['data'];
      $$('#tx_nama').val(resep_api[0].nama);
      $$('#tx_deskripsi').val(resep_api[0].deskripsi);
      $$('#tx_foto').val(resep_api[0].foto);
      $$('#tx_bahan').val(resep_api[0].bahan);
      $$('#tx_langkah').val(resep_api[0].langkah);
      $$('#ul_kategori').html(resep_api[0].kategori);
    });
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/kategori.php", {}, function (data) {
      var arr = JSON.parse(data);
      var resep = arr['data'];
      resep.forEach((t, index) => {
        $$('#sel_kategori').append("<option value='" + t.idkategori + "'>" + t.nama + "</option>");
      });
    });
    $$('#btnsubmit').on('click', function () {
      app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/editresep.php", {
        "idresep": id,
        "nama": $$('#tx_nama').val(),
        "bahan": $$('#tx_bahan').val(),
        "langkah": $$('#tx_langkah').val(),
        "deskripsi": $$('#tx_deskripsi').val(),
        "foto": $$('#tx_foto').val(),
        "idkategori": $$('#sel_kategori :checked').val()
      }, function (data) {
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == 'success') {
          app.dialog.alert('Resep berhasil diubah!');
          page.router.navigate("/resepsaya");
        } else {
          app.dialog.alert('Resep gagal diubah!');
        }
      });
    });
  } else if (page.name == "resepsaya") {
    var uname = localStorage.username;
    app.request.post("http://ubaya.fun/hybrid/160419083/resep_api/resepsaya.php", { "username": uname }, function (data) {
      var arr = JSON.parse(data);
      var resep_api = arr['data'];
      resep_api.forEach((t, index) => {
        $$("#resepsaya").append("<div class='col-50'><div class='card'>" +
          "<div class='card-header'><a href='/detailresepsaya/" + t.idresep + "'>" + t.nama + "</a></div><div class='card-content'>" +
          "<img src='" + t.foto + "' width='100%'>" + "</div></div></div>");
      });
    });
  }
});