if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
function svc_twit_megnific_script(){
	jQuery('span.svc_twit_photo').magnificPopup({
	  type: 'image',
	  closeBtnInside:false,
	  mainClass: 'ssocial-popup-close'
	});	
	jQuery('span.svc_twit_video').magnificPopup({
          type: 'ajax',
		  mainClass: 'ssocial-popup-close',
		  closeBtnInside:false,
		  closeOnBgClick: false
	});
}
function intToString_counter (value) {
    var suffixes = ["", "k", "m", "b","t"];
    var suffixNum = Math.floor((""+value).length/4);
    var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
        var shortNum = shortValue.toFixed(1);
    }
    return shortValue+suffixes[suffixNum];
}
var sv = 0;
var si = 0;
var social_dataa = '';
(function($, window, document, undefined) {
    $.fn.svc_twitt_social_stream = function(_options) {


        var defaults = {
            plugin_folder: '', // a folder in which the plugin is located (with a slash in the end)
            template: 'template.html', // a path to the template file
            show_media: false, // show images of attachments if available
			hide_like: false,
            media_min_width: 300,
            length: 150, // maximum length of post message shown
			effect:'',
            insta_access_token:'',
			grid_columns_count_for_desktop:'',
			grid_columns_count_for_tablet:'',
			grid_columns_count_for_mobile:'',
			popup:'',
			on_cache: '',
			cache_time: '',
			cache_id: '',
			stream_id:''
        };
        moment.locale('en');
        console.log(svc_ajax_url.laungage);
        moment.locale(svc_ajax_url.laungage);
        //---------------------------------------------------------------------------------
        var options = $.extend(defaults, _options),
            container = $(this),
            template,
            social_networks = ['twitter'];
        //---------------------------------------------------------------------------------

        //---------------------------------------------------------------------------------
        // This function performs consequent data loading from all of the sources by calling corresponding functions

        function fireCallback(dataa_social) {
            var fire = true;
            if (fire && options.callback) {
                options.callback(dataa_social);
				svc_twit_megnific_script();
				social_dataa = '';
				
            }
        }

        var Utility = {
            request: function(url, callback) {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    success: callback
                });
            },
			request_json: function(url, callback) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    success: callback
                });
            },
            get_request: function(url, callback) {
                $.get(url, callback, 'json');
            },
            wrapLinks: function(string, social_network) {
				
                var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                
				string = string.replace(exp, Utility.wrapLinkTemplate);
				string = string.replace(/(^|\s)#(\w+)/g, Utility.wrapTwitterTagTemplate);
				string = string.replace(/(^|\s)@(\w+)/g, Utility.wrapTwitterUserTemplate);
				//string = string.replace(/(^|\s)#(\w+)/g, "$1<a href='https://twitter.com/hashtag/$2/' target='_blank' class='svc_hashtags'>#$2</span>");				
                return string;
            },
            wrapLinkTemplate: function(string) {
				//string = string.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hash_tag'>$2</span>");
                return '<a target="_blank" href="' + string + '">' + string + '<\/a>';
            },
            wrapTwitterTagTemplate: function(string) {
                return '<a target="_blank" href="https://twitter.com/hashtag/' + string.trim().slice( 1 ) + '" class="twit_hashtag">' + string + '<\/a>';
            },
			wrapTwitterUserTemplate: function(string) {
                return '<a target="_blank" href="https://twitter.com/' + string.trim().slice( 1 ) + '" class="twit_hashtag">' + string + '<\/a>';
            },
            shorten: function(string) {
                string = $.trim(string);
				//console.log(options.length);
				//console.log(string.length);
                if (string.length > options.length) {
                    return jQuery.trim(string).substring(0, options.length).split(" ").slice(0, -1).join(" ") + "...";
                } else {
                    return string;
                }
            },
            stripHTML: function(string) {
                if (typeof string === "undefined" || string === null) {
                    return '';
                }
                return string.replace(/(<([^>]+)>)|nbsp;|\s{2,}|/ig, "");
            },
			isotop_loop: function(){
				sv++;
				console.log(si+' = '+sv);
				//if(si === sv){
					fireCallback(social_dataa);
				//}
			},
			isotop_insert: function(rendered_html){
				jQuery('.social-feed-container_'+options.stream_id).isotope({transformsEnabled: false,isResizeBound: false,transitionDuration: 0}).isotope( 'insert',jQuery( rendered_html ) );
			}
        };

        function SocialFeedPost(social_network, data) {
            this.content = data;
            this.content.social_network = (social_network == 'vimeo') ? 'vimeo-square' : social_network;
            this.content.attachment = (this.content.attachment === undefined) ? '' : this.content.attachment;
            this.content.time_ago = data.dt_create.locale(svc_ajax_url.laungage).fromNow();
			var dp = this.content.dt_create.locale('en').format("YYYY-MM-DD, hh:mm:ss");
			var d = new Date(dp);
			this.content.dt_create = d.getTime();
            //this.content.dt_create = this.content.dt_create.locale('en').format("MMMM DD, YYYY");
            //this.content.dt_create = this.content.dt_create.valueOf();
            this.content.text = Utility.wrapLinks(Utility.shorten(data.message + ' ' + data.description), data.social_network);
            this.content.moderation_passed = (options.moderation) ? options.moderation(this.content) : true;
			this.content.effect = options.effect;
			this.content.grid_columns_count_for_desktop = options.grid_columns_count_for_desktop;
			this.content.grid_columns_count_for_tablet = options.grid_columns_count_for_tablet;
			this.content.grid_columns_count_for_mobile = options.grid_columns_count_for_mobile;
			this.content.like = this.content.like;
			this.content.retwit = this.content.retwit;
			this.content.like_display = (options.hide_like) ? 'yes' : 'no';

            Feed[social_network].posts.push(this);
        }
        SocialFeedPost.prototype = {
            render: function() {
                var rendered_html = Feed.template(this.content);
                var data = this.content;
                if ($(container).children('[social-feed-id=' + data.id + ']').length !== 0) {
                    return false;
                }

                if ($(container).children().length === 0) {
				   if($('.social-feed-container_'+options.stream_id).html() === ''){
					   social_dataa += rendered_html;
						//Utility.isotop_insert(rendered_html);
				   }else{
					   social_dataa += rendered_html;
					}
                } else {
                    var i = 0,
                        insert_index = -1;
                    $.each($(container).children(), function() {
                        if ($(this).attr('dt-create') < data.dt_create) {
                            insert_index = i;
                            return false;
                        }
                        i++;
                    });
					
					social_dataa += rendered_html;
                }
				
                if (options.media_min_width) {

					var query = '[social-feed-id=' + data.id + '] img.attachment';
					var image = $(query);

					// preload the image
					var height, width = '';
					var img = new Image();
					var imgSrc = image.attr("src");

					$(img).load(function () {

					    if (img.width < options.media_min_width) {
                            //image.hide();
                        }
					    // garbage collect img
					    delete img;

					}).error(function () {
					    // image couldnt be loaded
					    image.hide();

					}).attr({ src: imgSrc });

				}
				
            }

        };

        var Feed = {
                template: false,
                init: function() {
                    Feed.getTemplate(function() {
                        social_networks.forEach(function(network) {
                            if (options[network]) {
                                options[network].accounts.forEach(function(account) {
									si++;
                                    Feed[network].getData(account);
                                });
                            }
                        });
						console.log(si);
                    });
                },
                getTemplate: function(callback) {
                    if (Feed.template){
                        return callback();
					}else {
                        if (options.template_html) {
                            Feed.template = doT.template(options.template_html);
							si = 0;
                            return callback();
                        } else {
                            $.get(options.template, function(template_html) {
                                Feed.template = doT.template(template_html);
								si = sv = 0;
                                return callback();
                            });
                        }
                    }
                },
                twitter: {
                    posts: [],
                    loaded: false,
                    api: 'http://api.tweecool.com/',

                    getData: function(account) {

						if($('#social_load_more_btn_'+options.stream_id).attr('data-twitter') == 'finish'){
							sv++;
							var twitter_data = $('#social_load_more_btn_'+options.stream_id).attr('data-twitter');
							if(twitter_data == ''){
								$('#svc_infinite').hide();
							}
						}
                        switch (account[0]) {
                            case '@':
								var userid = account.substr(1);
								var max_id = '';
								var first_tweet_load = '';
								var twit_max_id = $('#social_load_more_btn_'+options.stream_id).attr('data-twitter');
								if(twit_max_id != '' && typeof twit_max_id != 'undefined'){
									max_id = '&max_id='+twit_max_id;
									options.twitter.limit = parseInt(options.twitter.limit) + 1;
								}
								
								if(twit_max_id != '' && typeof twit_max_id != 'undefined' && twit_max_id != 'finish'){
									first_tweet_load = '&ajx=y';
								}
								if(twit_max_id != 'finish'){
									$.ajax({
										url: svc_ajax_url.url,
										data : 'action=svc_twit_get_tweet'+first_tweet_load+'&include_retweet='+options.twitter.include_retweet+'&on_cache='+options.on_cache+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&user_name='+userid+'&limit='+options.twitter.limit+max_id,
										dataType:"json",
										type: 'POST',
										success: function(response) {
											console.log(response);
											Feed.twitter.utility.getPosts(response,'');
										}
									});
								}
                                break;
                            case '#':
                                var hashtag = account.substr(1);
								if(typeof options.twitter.loadmore === 'undefined'){
									var main_lm = 'action=svc_twit_get_search_tweet&q='+hashtag+'&include_retweet='+options.twitter.include_retweet+'&on_cache='+options.on_cache+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&limit='+options.twitter.limit;
								}else{
									var lm = options.twitter.loadmore;
									var main_lm = 'action=svc_twit_get_search_tweet&ajx=y&include_retweet='+options.twitter.include_retweet+'&on_cache='+options.on_cache+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&other=yes&limit='+options.twitter.limit+'&que='+lm.replace('?','');
								}
								$.ajax({
									url: svc_ajax_url.url,
									data : main_lm,
									dataType:"json",
									type: 'POST',
									success: function(reply) {
										if (typeof reply['search_metadata'] === "undefined") {
											reply['search_metadata'] = "undefined";
											reply['search_metadata']['refresh_url'] = "undefined";
										}
										if (typeof reply['search_metadata']['refresh_url'] !== "undefined" && reply['search_metadata']['refresh_url'] !== "undefined") {
											$('#social_load_more_btn_'+options.stream_id).attr('data-twitter',reply['search_metadata']['refresh_url']);
										}else{
											$('#social_load_more_btn_'+options.stream_id).attr('data-twitter','finish');
										}
										Feed.twitter.utility.getPosts(reply.statuses,'search');
									}
								});
                                break;
                            default:
                        }
                    },
                    utility: {
                        getPosts: function(json,searchh) {
							//console.log(json);
							if(json.length == 0){
								$('#social_load_more_btn_'+options.stream_id).attr('data-twitter','finish');	
							}
                            if (json) {
								var tc = 0;
                                $.each(json, function() {
									tc++;							
                                    var element = this;
									if(searchh != 'search'){
										$('#social_load_more_btn_'+options.stream_id).attr('data-twitter',element['id']);
									}
                                    var post = new SocialFeedPost('twitter', Feed.twitter.utility.unifyPostData(element));
                                    post.render();
                                });
								
								if(json.length == tc){
									Utility.isotop_loop();	
								}
								
                            }
                        },
                        unifyPostData: function(element) {
							//console.log(element);
                            var post = {};
                            if (element.id) {
                                post.id = element.id_str;				
                                post.dt_create = moment(element.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en');
                                post.author_link = 'http://twitter.com/' + element.user.screen_name;
                                if (location.protocol == 'https:'){
                                	post.author_picture = element.user.profile_image_url_https;
								}else{
									post.author_picture = element.user.profile_image_url;
								}
                                post.post_url = post.author_link + '/status/' + element.id_str;
                                post.author_name = element.user.name;
                                post.message = (element.full_text) ? element.full_text : element.text;
                                post.description = '';
                                post.link = 'http://twitter.com/' + element.user.screen_name + '/status/' + element.id_str;
								
								post.like = intToString_counter(element.favorite_count);	
								
								/*if(typeof element.retweeted_status === "undefined"){
									post.like = 0;
								}else{
									post.like = intToString_counter(element.retweeted_status.favorite_count);	
								}*/
								if(typeof element.retweet_count === "undefined"){
									post.retwit = 0;
								}else{
									post.retwit = intToString_counter(element.retweet_count);	
								}
								/*if(typeof element.retweeted_status === "undefined"){
									post.retwit = 0;
								}else{
									post.retwit = intToString_counter(element.retweeted_status.retweet_count);	
								}*/
								var video_url = '';
								//console.log(element);
								if (typeof element.retweeted_status !== "undefined" && typeof element.retweeted_status.extended_entities !== "undefined" && typeof element.retweeted_status.extended_entities.media !== "undefined") {
									var media_type = element.retweeted_status.extended_entities.media[0].type;
									if (typeof element.retweeted_status.extended_entities.media[0].video_info !== "undefined"){
										/*if (element.retweeted_status.extended_entities.media[0].video_info.variants[0].content_type == "video/mp4"){
											video_url = element.retweeted_status.extended_entities.media[0].video_info.variants[0].url;
										}else if (element.retweeted_status.extended_entities.media[0].video_info.variants[1].content_type == "video/mp4"){
											video_url = element.retweeted_status.extended_entities.media[0].video_info.variants[1].url;
										}*/
										var each_video = element.retweeted_status.extended_entities.media[0].video_info.variants;
										//console.log(each_video);
										var bit_video = 0;
										$.each(each_video, function() {
											var vi = this;					  
											if (vi.content_type == "video/mp4" && bit_video < vi.bitrate){
												bit_video = vi.bitrate;
												video_url = vi.url;
												//video_url = element.retweeted_status.extended_entities.media[0].video_info.variants[3].url;
											}
										});
									}
								}else if(typeof element.extended_entities !== "undefined" && typeof element.extended_entities.media !== "undefined"){
									var media_type = element.extended_entities.media[0].type;
									if (typeof element.extended_entities.media[0].video_info !== "undefined"){
										/*if (element.extended_entities.media[0].video_info.variants[0].content_type == "video/mp4"){
											video_url = element.extended_entities.media[0].video_info.variants[0].url;
										}else if (element.extended_entities.media[0].video_info.variants[1].content_type == "video/mp4"){
											video_url = element.extended_entities.media[0].video_info.variants[1].url;
										}*/
										var each_video = element.extended_entities.media[0].video_info.variants;
										var bit_video = 0;
										$.each(each_video, function() {
											var vi = this;	
											if (vi.content_type == "video/mp4" && bit_video < vi.bitrate){
												bit_video = vi.bitrate;
												video_url = vi.url;
												//video_url = element.retweeted_status.extended_entities.media[0].video_info.variants[3].url;
											}
										});
									}
								}else{
									var media_type = 'photo';
								}

                                if (options.show_media === true) {
									if (typeof element.retweeted_status !== "undefined" && typeof element.retweeted_status.entities.media !== "undefined") {
										//if (element.retweeted_status.entities.media.length > 0) {
											if (location.protocol == 'https:'){
												var image_url = element.retweeted_status.entities.media[0].media_url_https;
											}else{
												var image_url = element.retweeted_status.entities.media[0].media_url;
											}
											if(media_type == 'video'){
												var video_url = 
												post.attachment = '<span class="svc_twit_video" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_twit_video_popup&video_url='+video_url+'"><img class="svc_attachment" src="' + image_url + '" /></span>';
											}else if (image_url) {
												post.attachment = '<span class="svc_twit_photo" href="' + image_url + '"><img class="svc_attachment" src="' + image_url + '" /></span>';
											}
										//}
                                    }
									
                                    if (typeof element.entities.media !== "undefined" && element.entities.media.length > 0) {
										if (location.protocol == 'https:'){
											var image_url = element.entities.media[0].media_url_https;
										}else{
											var image_url = element.entities.media[0].media_url;
										}
										if(media_type == 'video'){
											post.attachment = '<span class="svc_twit_video" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_twit_video_popup&video_url='+video_url+'"><img class="svc_attachment" src="' + image_url + '" /></span>';
										}else if (image_url) {
                                            post.attachment = '<span class="svc_twit_photo" href="' + image_url + '"><img class="svc_attachment" src="' + image_url + '" /></span>';
                                        }
                                    }
									
                                }
                            }
							post.feed = "svc_twitter";
                            return post;
                        },
                    }

                }
            };
            // Initialization
        Feed.init();
        if (options.update_period) {
            setInterval(function() {
                return Feed.init();
            }, options.update_period);
        }
    };

})(jQuery);
