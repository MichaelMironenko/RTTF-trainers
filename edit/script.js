function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
  scrollToActiveTab(evt.currentTarget);
}

function scrollToActiveTab(activeTab) {
  var scrollContainer = document.querySelector(".tab");
  var scrollAmount = activeTab.offsetLeft - scrollContainer.offsetLeft;
  scrollContainer.scrollLeft =
    scrollAmount -
    (scrollContainer.offsetWidth / 2 - activeTab.offsetWidth / 2);
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".tablinks").click();
});
