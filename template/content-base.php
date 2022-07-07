<?php
/**
 * The template for displaying conference information
 *
 * @package Understrap
 */

//base template
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );?>

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
    <div id="placeholder_videoID_div" style="display: none;">5GULsZHVyv8</div>
   

