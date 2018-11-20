const cameraDraw = {
  items: null,
  selectedVideo: null,

  canplay: function(ev) {
    document.querySelector('#video').style.display = 'block';
    document.querySelector('#videos').style.display = 'none';

    this.video = document.querySelector('#video');
    videoWidth = this.video.videoWidth;
    videoHeight = this.video.videoHeight;
    this.video.setAttribute('width', videoWidth);
    this.video.setAttribute('height', videoHeight);
    this.video.muted = false;
    this.video.play();
  },

  getItems: function() {
    $.ajax({
      url: 'data/items.json',
      contentType: 'application/json',
      dataType: 'json'
    }).then(this.onGetItemsSuccess.bind(this), this.onGetItemsError.bind(this));
  },

  onGetItemsSuccess: function(result) {
    this.items = {};
    const itemsLength = result.items.length;
    const items = document.createElement('div');

    for (let i = 0; i < itemsLength; i++) {
      const curItem = result.items[i];
      this.items[curItem.id] = curItem;

      const newItem = document.createElement('div');
      const newItemImg = document.createElement('img');
      const newItemBtn = document.createElement('div');

      newItemImg.setAttribute('src', curItem.thumb);
      newItemImg.setAttribute('id', 'img_' + curItem.id);
      newItemBtn.setAttribute('class', 'playIcon');
      newItemBtn.setAttribute('id', 'playBtn_' + curItem.id);

      newItem.setAttribute('id', curItem.id);
      newItem.setAttribute('class', 'videoItem');

      newItem.appendChild(newItemImg);
      newItem.appendChild(newItemBtn);

      newItem.addEventListener('click', this.startVideo.bind(this), false);
      items.appendChild(newItem);
    }
    document.querySelector('#videos').appendChild(items);
  },

  onGetItemsError: function() {},

  startVideo: function(e) {
    const id = e.target.id.replace('img_', '').replace('playBtn_', '');
    this.selectedVideo = this.items[id];
    document.querySelector('#video').src = this.items[id].video;
  },

  showAd: function() {
    this.video.pause();
    document.querySelector('#adInfo').style.display = 'block';
    document.querySelector('#adInfo').innerHTML = '<h1>' + this.selectedVideo.title + '</h1>';
  }
};

$(document).ready(() => {
  document.querySelector('#video').onloadeddata = cameraDraw.canplay.bind(cameraDraw);
  document.querySelector('#video').onclick = cameraDraw.showAd.bind(cameraDraw);
  cameraDraw.getItems.bind(cameraDraw);
  cameraDraw.getItems();
});
