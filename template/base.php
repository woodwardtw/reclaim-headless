<?php
//base template
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Form of Awesome - Reclaim EdTech</title>
    <link
      rel="icon"
      type="image/png"
      href="https://formofawesome.com/wp-content/uploads/2022/05/form_awesome.png"
    />
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    />
    <link rel="stylesheet" href="https://watch.reclaimed.tech/css/bulma.css" />
    <link rel="stylesheet" href="https://watch.reclaimed.tech/css/roadshow.css" />
    <link rel="stylesheet" href="https://watch.reclaimed.tech/css/taylor.css" />
  </head>
  <body>
    <section class="hero is-fullheight">
      <!-- Hero head: will stick at the top -->
      <div class="hero-head">
        <header class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item" href="https://reclaimed.tech/form-of-awesome/" target="_blank">
                <img
                  class="mr-2"
                  src="https://formofawesome.com/wp-content/uploads/2022/05/form_awesome.png"
                  alt="Logo"
                /><span
                  class="site-name is-size-12 is-uppercase has-text-weight-bold"
                  >Form of Awesome - Reclaim EdTech</span
                >
              </a>
              <span class="navbar-burger" data-target="navbarMenuHeroC">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHeroC" class="navbar-menu">
              <div class="navbar-end">
                <!-- <a class="navbar-item is-active"> Register </a>
                <a class="navbar-item"> Schedule </a>
                <a class="navbar-item"> Previous Workshops </a> -->
              </div>
            </div>
          </div>
        </header>
        <div
          class="
            programs
            container
            px-2
            is-flex is-flex-direction-row is-flex-wrap-nowrap is-horz-scrolling
          "
        ></div>
        <div class="modals"></div>
      </div>
      <div class="hero-body p-1">
        <div class="container is-fluid">
          <div class="columns is-multiline is-1">
            <div class="column is-full pb-0">
              <div class="field">
                <input
                  id="live-box"
                  type="checkbox"
                  name="switchRoundedOutlinedDefault"
                  class="switch is-rounded is-outlined is-success"
                />
                <label
                  class="is-uppercase has-text-success has-transition"
                  for="live-box"
                  >Live</label
                >
              </div>
            </div>
            <div class="column is-two-thirds is-relative">
              <figure id="player-figure" class="is-invisible image is-16by9">
                <iframe
                  id="player"
                  class="has-ratio box p-0"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/5GULsZHVyv8?enablejsapi=1"
                  title="Form of Awesome - Reclaim EdTech"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </figure>
            </div>
            <div class="column is-one-third">
              <iframe
                class="has-ratio box p-0 is-bordered is-min-height-250"
                src="https://titanembeds.com/embed/954008116800938044?theme=IceWyvern&defaultchannel=954421749712298024"                height="100%"
                width="100%"
                frameborder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div id="api_url_div" style="display: none;">https://roadshowwp.uk.reclaim.cloud/wp-json/wp/v2/presentation?per_page=99&categories=212</div>
    // <div id="placeholder_videoID_div" style="display: none;">5GULsZHVyv8</div>
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js"></script>
    // <script src="https://watch.reclaimed.tech//js/luxon.js"></script>
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"></script>
    // <script src="https://watch.reclaimed.tech//js/app.js"></script>
  </body>
</html>
