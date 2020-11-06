$(document).ready(function () {
  $(".alertMessageBar").hide();
  $("#displayContent").hide();
  setTimeout(function () {
    $("#loadingContent").fadeOut(600, () => {
      loadForm();
    });
  }, 1200);
});

function validateURL(event) {
  var steamURL = $(".steamURLInput").val();
  var steamURLRegex = new RegExp(
    "(?:https?://)?steamcommunity.com/(?:profiles|id)/[a-zA-Z0-9]+"
  );

  var regexTest = steamURLRegex.test(steamURL);

  if (regexTest) {
    //Call API
    $(".alertMessageBar").fadeOut(500);
    extractUniqueIdentifier(steamURL);
    event.preventDefault();
  } else {
    $(".alertMessageBar").fadeIn(500);
    event.preventDefault();
  }
}

function extractUniqueIdentifier(URL) {
  $("#displayContent").fadeOut(400, () => {
    $("#loadingContent").fadeIn(400);
  });

  var splitifier = "/id/";
  var identifier = URL.substring(
    URL.lastIndexOf(splitifier.toString()) + splitifier.toString().length,
    URL.length - 1
  );

  retrieveProfileDetails(identifier);
}

function retrieveProfileDetails(uniqueIdentifier) {
  $.get(
    "http://localhost:3030/getSteamProfile?uniqueIdentifier=" +
      uniqueIdentifier,
    function (result) {
      $("#loadingContent").fadeOut(600, () => {
        displayProfileDetails(result);
      });
    }
  );
}

function displayProfileDetails(jsonData) {
  /*console.log(jsonData.steamid);
    console.log(jsonData.personaname);
    console.log(jsonData.commentpermission);
    console.log(jsonData.profileurl);
    console.log(jsonData.avatarfull);
    console.log(jsonData.lastlogoff);
    console.log(jsonData.timecreated);
    console.log(jsonData.loccountrycode);*/

  var htmlDisplayProfile = `<img
    src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/58/586f3a4f6fbbd84d61cab7742487d9acc250d539_full.jpg"
    class="img img-fluid mx-auto d-block border border-danger rounded"
    alt="Avatar"
  />
  <div class="text-center text-light mt-5">
    <p><strong>Profile Name: </strong> ${jsonData.personaname}</p>
    <p><strong>Profile URL: </strong> ${jsonData.profileurl}</p>
    <p><strong>Profile Hex ID: </strong> ${jsonData.steamid}</p>
    <p><strong>Country: </strong> ${jsonData.loccountrycode}</p>
    <p><strong>Comment Permission: </strong> ${
      jsonData.commentpermission == 0 ? "Enabled" : "Disabled"
    }</p>
  </div>`;

  loadContent(htmlDisplayProfile);
}

function loadForm() {
  var htmlForm = `<div class="row">
    <div class="col-sm-4"></div>
    <div class="col-sm-4">
      <form>
        <div class="form-group">
          <label for="inputURL" class="text-light">Steam Account URL</label>
          <input
            type="text"
            class="form-control steamURLInput"
            id="inputURL"
            aria-describedby="steamURLHelp"
            placeholder="Enter steam account URL"
          />
          <small id="emailHelp" class="form-text text-muted"
            >We'll not share this with anyone else.</small
          >
        </div>
        <small class="text-light" style="display: block"
          >This form does not retrieve nor store personal details.</small
        >
        <button type="submit" class="btn btn-md btn-dark rounded mt-5 mx-auto d-block" onclick="validateURL(event)">
          Submit
        </button>
      </form>
    </div>
    <div class="col-sm-4"></div>
  </div>`;
  loadContent(htmlForm);
}

function loadContent(htmlCode) {
  $("#displayContent").html(htmlCode).fadeIn(600);
}
