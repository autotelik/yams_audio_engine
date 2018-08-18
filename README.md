# Datashift Audio Engine

Audio player for Rails apps.


## Installation
Add this line to your application's Gemfile:

```ruby
gem 'datashift_audio'
```

And then execute:
```bash
$ bundle
```

Or install it yourself as:
```bash
$ gem install datashift_audio
```

### Including assets to project

in `application.js`

```js
//= require datashift_audio/application
```

in `application.css`

```css
/*
 *= require datashift_audio/application
 */
```

or in `application.css`

```css
/*
 *= require datashift_audio/cover
 *= require datashift_audio/icons
 *= require datashift_audio/playlist
 *= require datashift_audio/volume
 *= require datashift_audio/player
 */
```

## Usage

### How do I add the player to any particular view

Add suitable markup to the view - can you  document the CSS/HTML markup required ?

The main target for the player is a div with id datashift-audio-player

CSS classes are availae to place the player at the `top` or `bottom` of the page

```
  <div id="datashift-audio-player" class="datashift-audio-player bar bottom">
```

Create a POST route that returns the JSON playlist data

  post 'radio', to: 'radio#show'

Now we can access route helper : radio_url

Sample snippet for creating the JSON playlist :

```ruby
  respond_to do |format|
     format.js   { render  json: {
        tracks: [
          {
              id: @track.id,
              author: 'aqwan',
              name: @track.title,
              audio_url: @track.audio.url(@track.audio.default_style, timestamp: false),
              cover_image: @track.cover_image,
              duration: 100
          }
        ]
      }.to_json }
    end
  ```
    
Add the following javascript to the actions erb template, calling load with the playlist data url defined above

```
<script type="text/javascript" charset="utf-8">
    $(document).ready(function(){
        datashift_audio.init();

        datashift_audio.load('<%= radio_url %>');

        datashift_audio.render_wave_from_audio_file();
 
    });
</script>
```

What is the purpose of the init function and how does it differ from the load function ?

How do I create the different styles in a view ?

- embedded button with on hover appearance/play (example, see emusic.com)
- full width, track with waveform style (example, see sound cloud)
- single thin banner for radio or linked to embedded button (example, see mixcloud, soundcloud)

How to style the player .. e.g is there a rails script to copy over the CSS from engine to app
so it can be over ridden ?


## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
