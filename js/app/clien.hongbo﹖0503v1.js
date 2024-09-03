function Hongbo() {
	var _this = this;
	
	// 직접홍보 리스트 5개 불러오기
	_this.hongboLists = function() {
		var url = API_HOST + '/hongbo/mainList';
		var html = '';
		$.ajax({
			url: url,
			type: 'GET',
			success: function (hongboInfo){
				$.each(hongboInfo, function (index, h) {
					html += '<div class="list_item">';
					html += '	<div class="list_title">';
					html += '		<a class="list_subject" href="'+BASE_URL+'/board/'+h.boardCd+'/'+h.boardSn+'">';
					html += '			<span class="shortname">·</span>';
					html += '			<span class="subject">';
					html += 			h.subject;;
					html += '			</span>';
					html += '		</a>';
					html += '	</div>';
					html += '</div>';
				});
				$("#hongboInfoList").html(html);
			},
			error: function (result) {
				console.log(result);
			}
		});
	}

	// 직접홍보 게시글 1개 호출
	_this.hongboList = function() {
		var url = BASE_URL + '/api/hongbo/pop';
		$.ajax({
			url: url,
			type: 'GET',
			success: function (hongboInfo){
				if(hongboInfo.boardSn != null) {
					var html = '	<div class="list_symph"><span class="label_ad">AD</span></div>';
						html += '	<div class="list_title">';
						html += '		<a class="list_subject" data-role="cut-string" href="'+BASE_URL+'/board/'+hongboInfo.boardCd+'/'+hongboInfo.boardSn+'">';
						html += 			hongboInfo.subject;
						html += '		</a>';
						html += '	</div>';
						html += '	<div class="list_author">';
						html += '		<span class="nickname"><span>'+hongboInfo.member.nick+'</span></span>';
						html += '	</div>';
						html += '	<div class="list_hit">';
						html += '		<span class="hit">'+hongboInfo.hitCount+'</span>';
						html += '	</div>';
						html += '	<div class="list_time">';
						html += '		<span class="time popover">'+(hongboInfo.insertDate).substring(5,10)+'<span class="timestamp">'+hongboInfo.insertDate+'</span></span>';
						html += '	</div>';
					$("#hongboInfoList").html(html).trigger("create");
				}
			},
			error: function (result) {
				console.log(result);
			}
		});
	}

	// 직접홍보 최신글 작성
	_this.reWrite = function() {
		var url = API_HOST + '/hongbo/reArticle';
		$.ajax({
			url: url,
			type: 'POST',
			data: {
				boardCd: app.env.boardCd,
				boardSn: app.env.boardSn
			},
			dataType: 'json',
			success: function(result) {
				alert("최신글로 등록이 완료 되었습니다.");
				var resultJson = result;
				var redirectUrl = BASE_URL + '/board/' + app.env.boardCd;
					redirectUrl += '/' + resultJson.boardSn;
				location.href = redirectUrl;
			},
			error: function(request, status, error) {
				if(request.status == 400) {
					var err = JSON.parse(request.responseText);
					alert(err.message);
					$('*[data-role=btn-write]').prop('disabled', false);
				} else {
					var errUrl = API_HOST + '/ajax/error';
					var	parm = {
							params : request.responseText,
							type : 'Article',
							location : 'write',
							boardCd : app.env.boardCd
						};
					util.ajaxError(errUrl, parm);
				}
			}
		});
	};

};

var hongbo = new Hongbo();