const _url =
  "https://my-json-server.typicode.com/ferrysusanto275/pwa_tutorial/products";
let data_result = "";
let cat_result = `<option value="all">Semua</option>`;
let categories = [];
$(document).ready(() => {
  let renderPage = (data) => {
    data.forEach((items) => {
      const _cat = items.category;
      data_result += `<div>
            <h3>${items.name}</h3>
            <p>${_cat}</p>
            </div>`;
      if (categories.indexOf(_cat) === -1) {
        categories.push(_cat);
        cat_result += `<option value="${_cat}">${_cat}</option>`;
      }
    });
    $("#products").html(data_result);
    $("#cat_select").html(cat_result);
  };
  let networkDataRecivied = false;

  //fresh data form online
  let networkUpdate = fetch(_url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      networkDataRecivied = true;
      renderPage(data);
    });

  //return from cache
  caches
    .match(_url)
    .then((response) => {
      if (response) throw Error("no data on cache");
      return response.json();
    })
    .then((data) => {
      if (!networkDataRecivied) {
        renderPage(data);
        console.log("render data form cache");
      }
    })
    .catch(() => {
      return networkUpdate;
    });
  //fungsi filter
  $("#cat_select").on("change", function () {
    updateProduct(this.value, 1);
  });
});

let updateProduct = (cat, init = 0) => {
  data_result = "";
  let fetch_url = _url;
  if (cat != "all") fetch_url += `?category=${cat}`;
  $.get(fetch_url, (data) => {
    data.forEach((items) => {
      const _cat = items.category;
      data_result += `<div>
            <h3>${items.name}</h3>
            <p>${_cat}</p>
            </div>`;
      if (init === 0) {
        if ($.inArray(_cat, categories) == -1) {
          categories.push(_cat);
          cat_result += `<option value="${_cat}">${_cat}</option>`;
        }
      }
    });
    $("#products").html(data_result);
    if (init === 0) {
      $("#cat_select").html(cat_result);
    }
  });
};

//pwa
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
