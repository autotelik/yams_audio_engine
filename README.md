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

### Save 

When playing a track the player can send back information to the server via the does the save callback

Info could be stored in session or in a DB table connected with User on BE side

For each callback should be related to route on BE side which connected with 
controller method that related user data 

init - 	it sends request during datashift_audio.init() function 

	call once when we need to sync basic player settings

	possible url structure 'user/get_state'
	
	it sends local variables of {user_token} and {client_token}
	and should obtain JSON with sync data of player
	The structure of answer is:

	{
	   saved: {
		service: {
		    user_token: '1234567890',
		    client_token: '0987654321',
		},

		audio_player: {
		    autoplay: false,
		    random: false,
		    repeat: null,
		    volume: 1,
		},

		audio: {
		    playlist: 'id',
		    
		    page: '1',
		    total_pages: '3',
		    
		    track: 0,
		    position: 0,
		}
	   }	
	}

load - 	it sends url and post characteristics of searchable playlist
	
	call once when we need to load playlist and set it into basic state on first open

	possible url structure 'playlist/:id.page' or 'audio/:id'

	request: { user_token, client_token, random }
	expected strucuture of answer:

	{
	    user_token: '1234567890',
	    client_token: '0987654321',

	    playlist: '0',

	    page: '1',
	    total_pages: '3',

	    track: '0',
	    position: '0',

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
		},

		{
		    id: '3',
	    
		    author: 'Full Name 3',
		    name: 'Third Track Name',

		    cover_image: 'http://localhost:3000/images/3.jpeg',
		    audio_url: 'http://localhost:3000/audio/3.mp3',

		    duration: 100,
		}
	    ],
	}

new_page -	it sends url and post characteristics of searchable playlist
	
		it calls when we need to load new page (manualy or automaticaly when page of 
		audios is ends) and updates playlist accordingly to flow

		possible url structure 'playlist/:id.page'

		request: url only
		expected strucuture of answer:

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
				},

				{
				    id: '3',
			    
				    author: 'Full Name 3',
				    name: 'Third Track Name',

				    cover_image: 'http://localhost:3000/images/3.jpeg',
				    audio_url: 'http://localhost:3000/audio/3.mp3',

				    duration: 100,
				}
			    ],
		}

save - 	it sends data of current state of player and playlist
	
	it calls:
		a) each second during playing current track

		b) player finished to play current track
		c) on pause() click
		d) on previous() click
		e) on next() click
		f) on seek() of track

	possible url structure 'user/set_state'

	request: {
            user_token
            client_token
            random
            audio_data: {
		service: {
		    user_token: '1234567890',
		    client_token: '0987654321',
		},

		audio_player: {
		    autoplay: false,
		    random: false,
		    repeat: null,
		    volume: 1,
		},

		audio: {
		    playlist: 'id',
		    
		    page: '1',
		    total_pages: '3',
		    
		    track: 0,
		    position: 0,
		}
	    }
        }
	expected strucuture of answer: 200 OK, or any error code u like

radio -	it gets description of current radio state

	it calls each second during radio playing
	
	possible url structure 'radio/:id'

	request: { radio_url }

	expected strucuture of answer:

	radio: {
		radio_url: 'http://air2.radiorecord.ru:805/rr_320',
		
		author: 'Full Name 3',
		track: 'Third Track Name',

		cover_image: 'http://localhost:3000/images/1.jpeg',
		audio_url: 'http://localhost:3000/audio/1.mp3',
		
		duration: 100,
		position: 0,
	    },


How to make list own list of audio tracks?

1. Get JSON list of tracks from BE
2. Create place and styles for items of tracks with squere look like in MixCloud but without inner items
3. Create items based on JSON list of tracks
4. Hang callbacks on items for play and pause btns
	This callbacks should set state of datashif_audio.audio_data.track to id of selected one
	set autoplay to true and call render_wave_from_audio_file() method to render player with selected audio
















































## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
