(function ($) {

  var path = window.location.pathname;
  
  var methods = {
    
    init: function(data) {
      // main container for items and menu
      $('<div/>', {
        id: 'notesee',
        css: {
          position: 'relative',
          left: 0,
          height: 1,
          width: data.width,
          zIndex: data.zindex,
          margin: (data.center == 1) ? '0 auto' : 0
        }
      })
      .prependTo('body');
      
      // create container menu
      $('<div/>', {
        id: 'notesee-menu',
        css: {
          position: 'fixed',
          bottom: 0,
          left: data.menu_left + 'px'
        }
      })
      .append('<span class="notesee-menu-title">notesee</span><span class="notesee-menu-new">+ new</span><span class="notesee-menu-hide">* hide all')
      .appendTo('div#notesee')
      .draggable({
        axis: 'x',
        handle: 'span.notesee-menu-title',
        stop: function(event, ui) {
          $.ajax({
            type: 'POST',
            url: '/notesee/menu-location/' + parseInt($('div#notesee-menu').css('top')) + '/' + parseInt($('div#notesee-menu').css('left'))
          });
        }
      });
      
      // create item container
      $('<div/>', {
        id: 'notesee-items',
        css: {
          height: 1
        }
      })
      .appendTo('div#notesee');
      
      // create a new notesee item
      $('div#notesee-menu span.notesee-menu-new').click(function() {
        $.fn.notesee('add');
      })
      
      // show all bind
      $('div#notesee-menu span.notesee-menu-hide').click(function() {
      	if ($(this).html() == '* hide all') {
      		$('div#notesee-items div.notesee-item').fadeOut(200);
      		$(this).html('* show all');
      	}
      	else {
      		$('div#notesee-items div.notesee-item').fadeIn(200);
      		$(this).html('* hide all');
      	}
      });
      
      // get notes for this page
      $.fn.notesee('check');
      
    },
    
    check: function() {
      $.ajax({
        data: {
          path: path
        },
        type: 'POST',
        url: '/notesee/check',
        success: function(data) {
          for(var i in data.current) {
            $.fn.notesee('add', data.current[i]);
          }
          if (data.all.length > 0) {
            for(var j in data.all) {
              $('<span/>', {
                html: '<a href="' + data.all[j].path + '">' + data.all[j].label + ' (' + data.all[j].total + ')</a>'
              }).appendTo($('div#notesee-menu'));
            }
          }
        }
      })
    },
    
    add: function(data) {
      // main container
      var div = $('<div/>', {
        'class': 'notesee-item',
        css: {
        	display: 'none'
        }
      });
      
      // add text container
      $(div)
      .append('<div class="notesee-item-text"><textarea></textarea></div>');
      
      // add actions container
      $(div)
      .append('<div class="notesee-item-actions"><span class="action-save">save</span><span class="action-delete">delete</span></div>');
      
      // add to the item container
      $(div)
      .prependTo('div#notesee-items');
      
      // set draggable
      $(div)
      .draggable({
      	scroll: true,
      	cursor: 'crosshair',
        stop: function(event, ui) {
          var notesee_id = $.data(div, 'notesee_id') == undefined ? 0 : $.data(div, 'notesee_id');
          if ($(div).find('textarea').val() != '' && notesee_id > 0) {
            $.fn.notesee('save', div);
          }
        }
      })
      .fadeIn(400);
      
      // delete button
      $(div).find('span.action-delete').click(function(e) {
	      var notesee_id = $.data(div, 'notesee_id') == undefined ? 0 : $.data(div, 'notesee_id');
      	if (notesee_id == 0 && $(div).find('textarea').val() == '') {
          $(div).fadeOut(200, function() {
          	$(this).remove();
          })
	      }
      	else if ($(this).html() == 'delete') {
      		$(this).html('really?');
      	}
        else {
          $(div).fadeOut(200, function() {
            $.ajax({
              type: 'POST',
              url: '/notesee/delete/' + $.data(div, 'notesee_id', notesee_id),
              success: function(data) {
                $(div).remove();
              }
            });
          });
        }
      }).mouseout(function() {
      	$(this).html('delete');
      });
      
      // save button
      $(div).find('span.action-save').click(function() {
        $.fn.notesee('save', div);
      });

      // default values
      if (data) {
        $(div).css({
          position: 'absolute',
          left: data.x + 'px',
          top: data.y + 'px'
        });
        
        $.data(div, 'notesee_id', data.notesee_id);
        $(div)
        .find('textarea')
        .val(data.note);
      }
      else {
        $(div).css({
	        position: 'absolute',
	        top: 50,
	        left: 0
				});      
      }
      
      // text area change
      $(div).find('textarea').keyup(function() {
        if ($(this).val() == '') {
          $(div)
          .find('span.action-save')
          .fadeOut(200);
        }
        else {
          $(div)
          .find('span.action-save')
          .html('text changed, save?')
          .fadeIn(200);
        }
      })
      .elastic();
      
    },
    
    save: function(div) {
      var notesee_id = $.data(div, 'notesee_id') == undefined ? 0 : $.data(div, 'notesee_id');
      $(this).html('saving...');
      $.ajax({
        data: {
          note: $(div).find('textarea').val(),
          path: path,
          x: parseInt($(div).css('left')),
          y: parseInt($(div).css('top')),
          width: parseInt($(div).css('width')),
          height: parseInt($(div).css('height'))
        },
        type: 'POST',
        url: '/notesee/save/' + $.data(div, 'notesee_id', notesee_id),
        success: function(data) {
          $.data(div, 'notesee_id', data.notesee_id);
          $(div)
          .find('span.action-save')
          .html('saved!')
          .delay(800)
          .fadeOut(200);
        }
      });    
    }
  }
  
  $.fn.notesee = function(method) {
    
    // Method calling logic
    if (methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };  

})(jQuery);
