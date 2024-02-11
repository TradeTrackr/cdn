current_host = window.location.host
	current_protocol = window.location.protocol
	style_values_loaded = false

	var style_cookie = getCookie("style")
	if (style_cookie == null) {
		load_style_from_api()
	}
	else {
	    style_cookie = style_cookie.split(";")[0]
		load_style_from_cookie(style_cookie)
	}



	function load_style_from_cookie(cookie_string){
		style_values = {}
		cookie_entries = cookie_string.split("|")
		for (entry in cookie_entries) {
			entry_data = cookie_entries[entry].split("=")
			key = entry_data[0]
			value = entry_data[1]

			style_values[key] = value
		}

		change_style(style_values)
	}

	function load_style_from_api(){
		Http = new XMLHttpRequest();
		url= current_protocol + "//" + current_host + "/api/style/get_style?url=" + current_host;
		Http.open("GET", url);
		Http.send();

		Http.onreadystatechange = (e) => {
		  if(Http.readyState === Http.DONE) {
		    response = JSON.parse(Http.responseText)
		    store_style_in_cookie(response)
		    change_style(response)
		  }
		}
	}

	function change_style(style_values) {
		active_style_values = style_values
		style_values_loaded = true
		let root = document.documentElement;

		if ("defaqto_video" in style_values) {
			defaqto_video = style_values["defaqto_video"]
			delete style_values["defaqto_video"];
		} else {
			defaqto_video = "https://www.youtube.com/embed/g4Jn9M7vVsA"
		}

		if ("accidental_damage" in style_values) {
			accidental_damage = style_values["accidental_damage"]
			delete style_values["accidental_damage"];
		} else {
			accidental_damage =  "https://www.youtube.com/embed/eRXeXEKgMuo"
		}
		if ("personal_posession" in style_values) {
			personal_posession = style_values["personal_posession"]
			delete style_values["personal_posession"];
		} else {
			personal_posession = "https://www.youtube.com/embed/LhD0CyiV80c"
		}

		if ("legal_protection" in style_values) {
			legal_protection = style_values["legal_protection"]
			delete style_values["legal_protection"];
		} else {
			legal_protection = "https://www.youtube.com/embed/XjkS78lxpbo"
		}

		if ("home_emergency" in style_values) {
			home_emergency = style_values["home_emergency"]
			delete style_values["home_emergency"];
		} else {
			home_emergency = "https://www.youtube.com/embed/zj2tOhEjAow"
		}

		if ("logo_url" in style_values) {
			logo_url = style_values["logo_url"]
			delete style_values["logo_url"];
		} else {
			logo_url = "https://optibroker.co.uk/cdn/static/logo.png"
		}

		try {
			document.getElementById("logo").src = logo_url
        }
        catch(err) {
            document.addEventListener("DOMContentLoaded", function(){
            	document.getElementById("logo").src = logo_url
            });
        }


        try {
			document.getElementById("defaqto_video").src = defaqto_video
        }
        catch(err) {
            document.addEventListener("DOMContentLoaded", function(){
            	document.getElementById("defaqto_video").src = defaqto_video
            });
        }

        try {
			document.getElementById("accidental_damage").src = accidental_damage
        }
        catch(err) {
            document.addEventListener("DOMContentLoaded", function(){
            	document.getElementById("accidental_damage").src = accidental_damage
            });
        }

        try {
			document.getElementById("personal_posession").src = personal_posession
        }
        catch(err) {
            document.addEventListener("DOMContentLoaded", function(){
            	document.getElementById("personal_posession").src = personal_posession
            });
        }

        try {
			document.getElementById("legal_protection").src = legal_protection
        }
        catch(err) {
            document.addEventListener("DOMContentLoaded", function(){
            	document.getElementById("legal_protection").src = legal_protection
            });
        }

        try {
			document.getElementById("home_emergency").src = home_emergency
        }
        catch(err) {
            document.addEventListener("DOMContentLoaded", function(){
            	document.getElementById("home_emergency").src = home_emergency
            });
        }


		for (key in style_values) {
			root.style.setProperty(key, style_values[key]);
		}

	}

	function store_style_in_cookie(style_values){
		cookie_string = ""
		for (key in style_values) {
			cookie_string = cookie_string + key + "=" + style_values[key] + "|"
		}
		cookie_string = cookie_string.slice(0, -1);
		var now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);
		document.cookie = "style=" + cookie_string + "; expires=" + now.toUTCString() + "; path=/"
	}

	async function start_video_pal(video_pal_name) {
		while(style_values_loaded = false) {
			await new Promise(r => setTimeout(r, 500));
		}


		default_video_pal_ids = {
			"insurance_welcome": "9LBaqCyuhAJG",
			"message_welcome": "hVGVaxgpz6pQ",
			"payments_welcome": "aGz74JGd5z76",
			"forms_welcome": "6WhVLe56RSUm",
			"document_welcome": "R9Q594PH9MUC",
			"sales1": "yD8WDKgGSTq9",
			"sales2": "UgyKZTDZSSkW",
			"welcome_message": "mWvCjhg7s8qP",
			"quote": "hg9bYjLMHQj4",
			"requested_staff": "FKcqQVmeNtu9",
			"staff_message_welcome":"5a88YxjxTFy8",
			"c":"AtZYf8HRTbrS",
			"dash1_avatar_bool":"AtZYf8HRTbrS",
			"dash2_avatar_bool":"BKMx2MRrxMJK",
			"help1_avatar_bool":"GTVsMBFdTaq6",
			"helpcreateclient_avatar_bool":"N2zV74N88cBT",
			"help2_avatar_bool":"nXj5Yg9Hh4c4",
			"help3_avatar_bool":"xBQSh3qXUyFt",
			"help4_avatar_bool":"nekWzP23ndCm",
			"help5_avatar_bool":"jmZbzNdrKKzQ",
			"newclient1_avatar_bool":"rNZkJ3AvyC8m",
			"newclient2_avatar_bool":"4J66mLUjWJxn",
			"newclient3_avatar_bool":"ey3EeRAmfUpM",
			"newclient4_avatar_bool":"kgUAbvgsRQeF",
			"newclient5_avatar_bool":"uzgnyTbjjqKm",
			"comms1_avatar_bool":"sY3G7CkepRaZ",
			"comms2_avatar_bool":"bdVuj9rtDEm4",
			"documenthandling1_avatar_bool":"TtCTLz5NuppJ",
			"documenthandling2_avatar_bool":"PQJ8ya9uqhZ7",
			"documenthandling3_avatar_bool":"BdhDSkEZQ5KE",
			"factfind1_avatar_bool":"68g7xUfVGRGP",
			"sourcing1_avatar_bool":"HMDRuV2PJeMC",
			"sourcing2_avatar_bool":"vqMj9JEb4v7X"

		}

	


		if (video_pal_name in active_style_values) {
			video_pal_id = active_style_values[video_pal_name]
		} else {
			video_pal_id = default_video_pal_ids[video_pal_name]
		}


		var vpPlayer = new VpPlayer({
		    embedId: video_pal_id
		});
	}


	function getCookie(name) {
	    var dc = document.cookie;
	    var prefix = name + "=";
	    var begin = dc.indexOf("; " + prefix);
	    if (begin == -1) {
	        begin = dc.indexOf(prefix);
	        if (begin != 0) return null;
	    }
	    else
	    {
	        begin += 2;
	        var end = document.cookie.indexOf(";", begin);
	        if (end == -1) {
	        end = dc.length;
	        }
	    }
	    // because unescape has been deprecated, replaced with decodeURI
	    //return unescape(dc.substring(begin + prefix.length, end));
	    return decodeURI(dc.substring(begin + prefix.length, end));
	}
