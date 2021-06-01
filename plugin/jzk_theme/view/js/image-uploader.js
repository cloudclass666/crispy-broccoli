jQuery(document).ready(function($) {
    $('#admin-img-file').change(function () {
        $(".file.btn").removeClass("error btn-danger success btn-success");
        for (var i = 0; i < this.files.length; i++) {
            var f = this.files[i];
            var formData = new FormData();
            formData.append('smfile', f);
            $.toast({
  title: '提示',
  subtitle: '图片上传',
  content: '图片正在上传，请稍等片刻……',
  type: 'info',
  delay: 3000,
  pause_on_hover: false
});
            $(".file.btn").addClass("loading");
            $.ajax({
                url: 'https://picup.cdn.jzku.top/wp-json/smms/api/v2/upload',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function (res) {
                    $(".file.btn").removeClass("loading");
                    $(".file.btn").addClass("success btn btn-success");
                    $('textarea#message').insertAtCaret('<img src="' + res.data.url + '" />');
                    $("html").find("iframe").contents().find("body").append('<img src="' + res.data.url + '" />');
                    $(".file.btn").removeClass("btn-success");
                },
                error: function (jqXHR, textStatus, errorThrown, res) {
                    $(".file.btn").removeClass("loading");
                    $(".file.btn").addClass("error btn-danger");
                    $.toast({
  title: '提示',
  subtitle: '图片上传',
  content: '可能您的图片违规，确认没有违规可尝试稍后再试',
  type: 'error',
  delay: 3000,
  pause_on_hover: false
});
            /*弹出jqXHR对象的信息*/
            console.error(jqXHR.responseText);
            console.error(jqXHR.status);
            console.error(jqXHR.readyState);
            console.error(jqXHR.statusText);
            /*弹出其他参数的信息*/
            console.error(textStatus);
            console.error(errorThrown);
            console.log(res);
        }
            })
        }
    });

    //加载图片
    $("#toggleModal").click(function(){
        pages = 2
        $("#img_list > li").remove()
        $.ajax({
            url: 'https:/www.piemind.cn/wp-json/smms/api/v2/list',
            type: 'GET',
            cache:false,
            dataType: 'json', 
            success: function(data) {
                for(var x in data){
                    $("#img_list").append('<li><img id="modal-image-' + x + '" class="modal-image" src="' + data[x].url + '" /></li>')
                }
                if (data.length < 10) {
                    $('#upload-btn').css('display','none');
                }else{
                    $('#upload-btn').css('display','inline-block');
                }
            }
        })
    }) 
    $("#upload-btn").click(function(){

        $.ajax({
            url: 'https://www.piemind.cn/wp-json/smms/api/v2/list',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                pages: pages
            },
            success: function(data) {
                if (data.length != 0) {
                    for(var x in data){
                        $("#img_list").append('<li><img id="modal-image-' + x + '" class="modal-image" src="' + data[x].url + '" /></li>')

                    }
                    pages++
                }else{
                    $('#upload-btn').css('display','none');
                    alert("已加载完全部图片")
                }
            }
        })
    })

    $(document).mouseup(function(e){
      var _con = $('.modal');   // 设置目标区域
      if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            $(".modal").css('display','none')
      }
    });


    //插入图片
    $("#img_list").on('click','img',function(e){
        $('textarea#message').insertAtCaret('<img src="' + e.target.src + '" />');
        $("html").find("iframe").contents().find("body").append('<img src="'+ e.target.src +'" />'); 
    }) 

    $.fn.extend({  
        insertAtCaret: function(myValue) {  
            var $t = $(this)[0];  
              //IE  
            if (document.selection) {  
                this.focus();  
                sel = document.selection.createRange();  
                sel.text = myValue;  
                this.focus();  
            } else  
            //!IE  
            if ($t.selectionStart || $t.selectionStart == "0") {  
                var startPos = $t.selectionStart;  
                var endPos = $t.selectionEnd;  
                var scrollTop = $t.scrollTop;  
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);  
                this.focus();  
                $t.selectionStart = startPos + myValue.length;  
                $t.selectionEnd = startPos + myValue.length;  
                $t.scrollTop = scrollTop;  
            } else {  
                this.value += myValue;  
                this.focus();  
            }  
        }  
    });
})
