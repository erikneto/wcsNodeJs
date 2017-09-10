var nome;
var context;
var recording;
window.onload = function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;

    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({ audio: true }, startUserMedia, function (e) {
        __log('No live audio input: ' + e);
    });
};

$(document).ready(function () {
    recording = false;
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            if ($('#inputChat').val() !== '')
                $("#btnChat").click();
            return false;
        }
    });
    $("#formChat").hide();
    $("#btnNome").click(function () {
        $("#formNome").hide();
        $("#formChat").show();
        nome = $('#inputNome').val();
        context = { nome: nome }
        sendMessage('');
    });
    $("#btnChat").click(function () {
        $('#logChat').append('<p>' + nome + ': ' + $('#inputChat').val());
        sendMessage($('#inputChat').val());
    });

    $("#btnAudio").click(function () {
        if (!recording) {
            recorder.record();
            recording = true;
            $("#btnAudio").html('Finalizar Gravação');
        } else {
            recorder.stop();
            recorder.exportWAV(exportaAudio, 'audio/wav');
            $("#btnAudio").html('Aguarde, processando');
            recording = false;
        }
    });

    function exportaAudio(blob) {
        var formData = new FormData();
        recorder.clear();
        formData.append('audio', blob);

        var xhr = new XMLHttpRequest();

        xhr.open('post', '/chat/Audio', true);

        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                const msg = JSON.parse(xhr.responseText);
                $("#btnAudio").html('Iniciar Gravação');
                //$('#inputChat').val(msg.retorno)
                $('#inputChat').val(msg.retorno.trim())
                $("#btnChat").click();
            }
        }
        xhr.send(formData);

    }

    function sendMessage(mensagem) {
        $.post('/chat/mensagem',
            {
                mensagem: mensagem,
                context: JSON.stringify(context)
            },
            function (data) {
                context = data.context;
                $('#logChat').append('<p>Watson: ' + data.resposta);
            }
        );
        $('#inputChat').val('');
    }

});
function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);

    recorder = new Recorder(input);
}
