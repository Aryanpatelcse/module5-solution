
$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

/* ✅ FIXED FILENAMES */
var menuItemsTitleHtml = "snippets/menu-items-title-snippet.html";
var menuItemHtml = "snippets/menu-item-snippet.html";

/* ---------- Utility Functions ---------- */

var insertHtml = function (selector, html) {
  document.querySelector(selector).innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(new RegExp(propToReplace, "g"), propValue);
};

var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(/active/g, "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

document.addEventListener("DOMContentLoaded", function () {

  function getRandomCategory(categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex].short_name;
  }

  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true
  );
});

/* ---------- HOME PAGE ---------- */

function buildAndShowHomeHTML(categories) {
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {
      var randomCategoryShortName = getRandomCategory(categories);

      var homeHtmlToInsertIntoMainPage = insertProperty(
        homeHtml,
        "randomCategoryShortName",
        "'" + randomCategoryShortName + "'"
      );

      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
    },
    false
  );
}

/* ---------- MENU CATEGORIES ---------- */

dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML
  );
};

function buildAndShowCategoriesHTML(categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          switchMenuToActive();

          var finalHtml = categoriesTitleHtml + "<section class='row'>";

          for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            html = insertProperty(html, "name", categories[i].name);
            html = insertProperty(html, "short_name", categories[i].short_name);
            finalHtml += html;
          }

          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false
      );
    },
    false
  );
}

/* ---------- MENU ITEMS ---------- */

dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML
  );
};

function buildAndShowMenuItemsHTML(categoryMenuItems) {
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          switchMenuToActive();

          menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml, "name",
              categoryMenuItems.category.name);
          menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml, "special_instructions",
              categoryMenuItems.category.special_instructions);

          var finalHtml = menuItemsTitleHtml + "<section class='row'>";
          var menuItems = categoryMenuItems.menu_items;
          var catShortName = categoryMenuItems.category.short_name;

          for (var i = 0; i < menuItems.length; i++) {
            var html = menuItemHtml;
            html = insertProperty(html, "short_name", menuItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertProperty(html, "name", menuItems[i].name);
            html = insertProperty(html, "description", menuItems[i].description);

            if (i % 2 !== 0) {
              html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }

            finalHtml += html;
          }

          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false
      );
    },
    false
  );
}

global.$dc = dc;

})(window);
