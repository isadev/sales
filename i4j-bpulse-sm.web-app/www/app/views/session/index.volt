<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/img/favicon.ico" type="image/x-icon">
        <title>Sales Web</title>
        {{ assets.outputCss() }}
        {{ assets.outputCss("cssAssets") }}
        {{ assets.outputCss("cssAplication") }}
    </head>
    <body class="body">
        <ul class="loading-container"><li></li><li></li><li></li><li></li></ul>
        <div id="overlay-container-loading"></div>
        <div id="wrapper">
            <!-- Modal -->
            <div class="modal fade" id="principalModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal-content-title" >Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="modal-content-body"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modal-btn-close" data-dismiss="modal" >Close</button>
                            <button type="button" class="btn btn-primary" id="modal-btn-save" >Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="navbar-menu-container"></div>
            <div id="sidebar-menu-container"></div>
            <div id="container-body"></div>
            <div id="footer-container"></div>
        </div>
        {{ assets.outputJs("jsAssets") }}
        {{ assets.outputJs("jsAplication") }}
    </body>
</html>
