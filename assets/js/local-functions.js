function make_embed_code(id){
	if ($("#" + id + "_embeditem").css("display") == 'none'){
    $("#" + id + "_embeditem").css("display", "flex")
    $("#" + id + "_button").html("Hide embed code")
  } else {
    $("#" + id + "_embeditem").css("display", "none")
    $("#" + id + "_button").html("Show embed code")
  }
}

function delete_items(anno_id, api_url, deletelist){
	var confirmation = confirm("Are you sure you want to delete?");
	if (confirmation == true){
	$.ajax({
		    url: api_url,
		    type: 'DELETE',
		    contentType: 'application/json',
		    data: JSON.stringify({'id':anno_id, 'deletelist': deletelist}),
		    processData: false,
		    async: false,
		    success: function( data, textStatus, jQxhr ){
		    	setTimeout(function(){
		    	alert(anno_id + " Deleted!")
		        location.reload(true)}, 300);
		    },
		    error: function( jqXhr, textStatus, errorThrown ){
		        console.log( errorThrown );
		    }
		});
	}
}

function create_items(api_url, homeurl) {
	for(var i =0; i < localStorage.length; i++){
		var key = localStorage.key(i);
		var canvas_regex = /(canvas(.*))|(.*(?=(\/info.json)))/;
		var matches = canvas_regex.exec(key);
		if(matches != null) {
			var fileContent = localStorage.getItem(key);
			var jsonparse = JSON.parse(fileContent);
			if (jsonparse.length > 0 && jsonparse[0]['@context'].indexOf('w3') == -1){
				for (var e = 0; e< jsonparse.length; e++){
					resource = _.unescape(JSON.stringify(jsonparse[e]['resource']))
					jsonparse[e]['resource'] = JSON.parse(resource)
				}
			}
		  var clean_key = key.replace("/info.json", "").replace(".json", "").replace(/\?/gm, "/").split("/").slice(-1)[0]
		  var id = clean_key.replace(/[^\w\-]+/g, '').replace(/_/g, "-")
			jsonparse = {'json':jsonparse, 'key': id, 'originurl':homeurl}
			$.ajax({
		    url: api_url,
		    dataType: 'json',
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(jsonparse),
		    processData: false,
		    success: function( data, textStatus, jQxhr ){
		        $('#response pre').html( JSON.stringify( data ) );
		    },
		    error: function( jqXhr, textStatus, errorThrown ){
		        console.log( errorThrown );
		    }
			});
		}
  }
}

function copytoclipboard(id) {
	var copyText = document.getElementById(id);
	copyText.select();
	document.execCommand("copy");
	var tooltip_id = id.replace("_embedcode", "_tooltip")
	var tooltip = document.getElementById(tooltip_id);
  tooltip.innerHTML = "Copied!";
}

function outFunc(id) {
  var tooltip = document.getElementById(id);
  tooltip.innerHTML = "Copy to clipboard";
}
