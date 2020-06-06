# Datashift Audio Engine

Audio player for Rails apps.

Add an audio player partial to any page. 

Configure player and playlist via JSON.

Receive player data back via callbacks.

## Installation

Add to Gemfile:

```ruby
gem 'yams_audio_engine'
```

And then execute:
```bash
$ bundle install
```

Add the JS to your application javascript file

```javascript
//= require yams_audio_engine
```

Some basic styles are provided in SASS, import the application style file

```scss
/*
@import "yams_audio_engine/yams_audio_engine";
 */
```

Or you can bring in only the individual items required

```scss
/*
@import "cover";
@import "icons";
@import "player";
@import "playlist";
@import "volume";
 */
```

### Setup 

Summary - To add an audio player

- Configure - includes the URLs required to initialise the player and load a playlist, or track to play.

- Add player and script partials to Views

- Create helper to convert your DB representation of Audio, e.g a Track, into track listings in the JSON format
 expected by the player.


#### Configuration 

The following variables can be used in the Javascript to configure the player.

```
is_radio        - true .. false
save_interval   - in milliseconds

routes.
    init_url    - url of action wich will authorize user and will load personalized 
                  information about player right for current user
                  
    load_url    - url of action wich will form playlist load action with params
    save_url    - url of action which will manage save status callback
    radio_url   - url of action which will manage loading a radio stream
    
settings.
    autoplay    - true .. false
    random      - true .. false
    repeat      - true .. false
    volume      - 0 .. 1
    
waveform_colors.
    wave_color          - regular css colors e.g   '#a7431c'
    progress_color      - regular css colors
    cursor_color        - regular css colors
    bar_width           - width in pixels
    

audio_data: {}          - main storage of current state of player
audio_data.playlist: {} - audio/track content of playlist

    visual: {}  - interface for interation with all visual elements connected with
                  this player
        
timer           - variable for management of regular actions ( save )
```

These can be set directly in Rails views, for example 

```erb
<script type="text/javascript" charset="utf-8">
    $(document).ready(function(){
        yams_audio_engine.settings.autoplay = true;
        yams_audio_engine.save_interval = 5000;
    });
</script>
```

To generate a Ruby configuration block, within the host Rails app's initializers, you can run the following rails generator

```bash
bundle exec rails generate yams_audio_engine:install
```

Each of the settable javascript settings, has an analogous setting in the Rails configuration block,
which can be used to set defaults or global values.

At some point in the flow, the Ruby value has to be assigned to the javascript audio player, for example

```erb
<script type="text/javascript" charset="utf-8">
  $(document).ready(function(){
        yams_audio_engine.settings.autoplay = YamsAudioEngine::Configuration.call.autoplay;
        yams_audio_engine.save_interval = YamsAudioEngine::Configuration.call.save_interval;
  });
</script>
```

#### Views 

To add the player to any view :

- Render the `yams_audio_engine/shared/player` partial, to generate the basic HTML markup.

- Render the `yams_audio_engine.init_player` helper, passing in JSON to configure the player.

- Render the `yams_audio_engine.load_playlist` helper, passing in JSON track listing to populate the player

TODO: Document the JSON schema for  data.tracks (assigned to datashift_audio.playlist = data.tracks;)


##### Example ERB snippet
  
```erb

<%= render partial: 'yams_audio_engine/shared/player' %>

<script type="text/javascript" charset="utf-8">
    yams_audio_engine.init_player('<%= raw datashift_audio_setup_json %>');

    yams_audio_engine.load_playlist('<%= raw datashift_audio_setup_json %>');
</script>
```

##### Example JSON Builder

This is an example Ruby JSON builder to generate the correct format JSON

```
 Jbuilder.encode do |json|
        json.datashift_audio do

          json.service do
            if current_user     #  Soem streamms such as Radio stream can be accessed by non signed in visitors
              json.user_token   current_user.id
              json.client_token '0987654321' # TODO: - add tokens to devise
            end
          end

          json.settings do
            json.autoplay true
          end

          json.waveform do
            json.wave_color     YamsAudioEngine::Config.call.wave_color
            json.progress_color YamsAudioEngine::Config.call.progress_color
            json.cursor_color   YamsAudioEngine::Config.call.cursor_color
            json.bar_width      'w-100'
          end

          json.playlist do
            json.tracks    YamsCore::AudioEnginePlayListBuilder.call(tracks, current_user)
            json.track_idx '0'
            json.position  '0'
          end

          # TODO: how is pagination gonna work ?
          json.pagination do
            json.page '0'
            json.total_pages 1
          end

        end
 ```
        
#### Call Backs

TODO: document the save state callback

##### Save - How to get current state - save callback ?

#### Javascript methods and call-backs

Each callback should be related to a route in the main Rails app side, connected to a suitable
controller method that can parse or store the supplied  data.


##### How to load audio data

The load_playlist function can be used to supply track listing and audio url information.

``` 
  yams_audio_engine.load_playlist('<%= raw datashift_audio_setup_json %>');
```

TODO: create and supply a JSON Schema for playlist initialisation :

    
```json
    json.playlist.tracks : [
        {
            id: '1',
            author: 'Full Name 1',
            name: 'First Track Name',
            cover_image: 'http://localhost:3000/images/1.jpeg',
            audio_url: 'http://localhost:3000/audio/1.mp3',
            duration: 100,
        },
        {
            id: '2',
      
            author: 'Full Name 2',
            name: 'Second Track Name',
            cover_image: 'http://localhost:3000/images/2.jpeg',
            audio_url: 'http://localhost:3000/audio/2.mp3',
            duration: 100,
        }, etc
       ],
   
```

You can also provide your own your own track listing HTML in property - `playlist_partial` - which will over ride the auto generated listing

For example, in the view rendering your playlist json also render a track listing partial and assign to json property `playlist_partial`

```
# app/views/radio/index.json.jbuilder

json.playlist_partial json.partial! 'my_audio_app/playlist.html.erb', locals: { tracks: @tracks }
``````





## How to do pagination?

```
new_page -      it sends url and post characteristics of searchable playlist
                it calls when we need to load new page (manualy or automaticaly when page of
                audios is ends) and updates playlist accordingly to flow
                possible url structure 'playlist/:id.page'
                request: url only
                expected strucuture of answer:
```
                    
```
    {
        page: '2',

        tracks: [
            {
                id: '1',
                author: 'Full Name 1',
                name: 'First Track Name',
                cover_image: 'http://localhost:3000/images/1.jpeg',
                audio_url: 'http://localhost:3000/audio/1.mp3',
                duration: 100,
            },
            {
                id: '2',
               
                author: 'Full Name 2',
                name: 'Second Track Name',
                cover_image: 'http://localhost:3000/images/2.jpeg',
                audio_url: 'http://localhost:3000/audio/2.mp3',
                duration: 100,
            }, ETC
        ],
    }
```

## How to get stream radio?

```
radio -   it gets description of current radio state
          it calls each second during radio playing
          possible url structure 'radio/:id'
          request: { radio_url }
          expected strucuture of answer:
```

```
    radio: {
        radio_url: 'http://air2.radiorecord.ru:805/rr_320',
        
        author: 'Full Name 3',
        track: 'Third Track Name',

        cover_image: 'http://link.to/images/1.jpeg',
        audio_url: 'http://link.to/audio/1.mp3',
        
        duration: 100,
        position: 0,
    },
```

#### Views - HTML Markup and CSS

##### How to pin to top/bottom?

CSS classes are available to place the player at the `top` or `bottom` of the page.

Default value is TOP

```
<%= datashift_audio_player_tag(pin_to: :top) %>
```

or 

```
<%= datashift_audio_player_tag(pin_to: :bottom) %>
```

 
###### Key Classes

To show elements :

```js
    $('#item').removeClass('datashift-audio-hide');
 ```  
     
To hide :

```js      
    $('#item').addClass('datashift-audio-hide');
```
                      
Track Controls :

- #datashift-audio-player .play
- #datashift-audio-player .pause

- #datashift-audio-player .datashift-audio-track-controls .previous
- #datashift-audio-player .datashift-audio-track-controls .next
    
    
Cover image : `datashift-audio-track-cover` 
    

```
.datashift-audio-player
    datashift-audio-track-cover
    .datashift-audio-track-basic-info
        .datashift-audio-track-name
        .datashift-audio-author-name
    .datashift-audio-wave-block
    ol.datashift-audio-playlist
    ol.datashift-audio-pages
```


## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
