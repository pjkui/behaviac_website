<?php
$v = "2.4.4";

if (isset($_GET['v'])) {
    $v = $_GET['v'];
}

//if ($_SERVER['SERVER_ADDR'] === '127.0.0.1') {
//    $embedJS = "embed-local.js";
//} else {
//    $embedJS = "embed.js";
//}
$data = "";
$enemiesCount = 0;
if (!empty($_GET)) {
    if ($_GET['level'] == 0) {
        $data = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="agent" x="113" y="63"><field name="agentType">0</field><statement name="nodes"><block type="tank_fireAtAngle"><field name="angle">60</field></block></statement></block></xml>';
    } else if ($_GET['level'] == 1) {
        $data = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="variables_set" x="112" y="38"><field name="VAR">item</field><value name="VALUE"><block type="math_number"><field name="NUM">40</field></block></value></block><block type="agent" x="113" y="88"><field name="agentType">0</field><statement name="nodes"><block type="sequence_topdown"><field name="type">1</field><statement name="actions"><block type="wait_topdown"><field name="times">1000</field><field name="property">time</field><statement name="actions"><block type="variables_set"><field name="VAR">item</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><shadow type="math_number"><field name="NUM">1</field></shadow><block type="variables_get"><field name="VAR">item</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow><block type="math_number"><field name="NUM">40</field></block></value></block></value><next><block type="tank_fireAtAngle_1"><value name="angle"><shadow type="math_number"><field name="NUM">67</field></shadow><block type="variables_get"><field name="VAR">item</field></block></value><next><block type="log_topdown"><value name="TEXT"><block type="text"><field name="TEXT">I Love Behaviac!</field></block></value></block></next></block></next></block></statement></block></statement></block></statement></block></xml>';
    } else if ($_GET['level'] == 2) {
        $data = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="variables_set" x="112" y="38"><field name="VAR">item</field><value name="VALUE"><block type="math_number"><field name="NUM">40</field></block></value></block><block type="variables_set" x="112" y="38"><field name="VAR">item</field><value name="VALUE"><block type="math_number"><field name="NUM">40</field></block></value></block><block type="agent" x="113" y="88"><field name="agentType">0</field><statement name="nodes"><block type="sequence_topdown"><field name="type">1</field><statement name="actions"><block type="wait_topdown"><field name="times">1000</field><field name="property">time</field><statement name="actions"><block type="variables_set"><field name="VAR">item</field><value name="VALUE"><block type="math_random_int"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow><block type="math_number"><field name="NUM">360</field></block></value></block></value><next><block type="tank_fireAtAngle_1"><value name="angle"><shadow type="math_number"><field name="NUM">67</field></shadow><block type="variables_get"><field name="VAR">item</field></block></value><next><block type="log_topdown"><value name="TEXT"><block type="variables_get"><field name="VAR">item</field></block></value><next><block type="log_topdown"><value name="TEXT"><block type="text"><field name="TEXT">I Love Behaviac!</field></block></value></block></next></block></next></block></next></block></statement></block></statement></block></statement></block></xml>';
    } else if ($_GET['level'] == 3) {
        $data = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="variables_set" x="112" y="38"><field name="VAR">item</field><value name="VALUE"><block type="math_number"><field name="NUM">40</field></block></value></block><block type="variables_set" x="112" y="38"><field name="VAR">item</field><value name="VALUE"><block type="math_number"><field name="NUM">40</field></block></value></block><block type="agent" x="113" y="88"><field name="agentType">0</field><statement name="nodes"><block type="sequence_topdown"><field name="type">1</field><statement name="actions"><block type="wait_topdown"><field name="times">1000</field><field name="property">time</field><statement name="actions"><block type="variables_set"><field name="VAR">item</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><shadow type="math_number"><field name="NUM">1</field></shadow><block type="variables_get"><field name="VAR">item</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow><block type="math_number"><field name="NUM">40</field></block></value></block></value><next><block type="tank_fireAtAngle_1"><value name="angle"><shadow type="math_number"><field name="NUM">67</field></shadow><block type="variables_get"><field name="VAR">item</field></block></value><next><block type="log_topdown"><value name="TEXT"><block type="variables_get"><field name="VAR">item</field></block></value><next><block type="log_topdown"><value name="TEXT"><block type="text"><field name="TEXT">I Love Behaviac!</field></block></value></block></next></block></next></block></next></block></statement><next><block type="wait_topdown"><field name="times">100</field><field name="property">time</field><statement name="actions"><block type="tank_moveForward"><next><block type="tank_turnRight"></block></next></block></statement></block></next></block></statement></block></statement></block></xml>';
    } else if ($_GET['level'] == 4) {
        $data = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="variables_set" x="112" y="38"><field name="VAR">item</field><value name="VALUE"><block type="math_number"><field name="NUM">40</field></block></value></block><block type="variables_set" x="112" y="38"><field name="VAR">item</field><value name="VALUE"><block type="math_number"><field name="NUM">40</field></block></value></block><block type="agent" x="113" y="88"><field name="agentType">0</field><statement name="nodes"><block type="sequence_topdown"><field name="type">1</field><statement name="actions"><block type="wait_topdown"><field name="times">1000</field><field name="property">time</field><statement name="actions"><block type="variables_set"><field name="VAR">item</field><value name="VALUE"><block type="math_random_int"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow><block type="math_number"><field name="NUM">1</field></block></value><value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow><block type="math_number"><field name="NUM">360</field></block></value></block></value><next><block type="tank_fireAtAngle_1"><value name="angle"><shadow type="math_number"><field name="NUM">67</field></shadow><block type="variables_get"><field name="VAR">item</field></block></value><next><block type="log_topdown"><value name="TEXT"><block type="variables_get"><field name="VAR">item</field></block></value><next><block type="log_topdown"><value name="TEXT"><block type="text"><field name="TEXT">I Love Behaviac!</field></block></value></block></next></block></next></block></next></block></statement><next><block type="wait_topdown"><field name="times">100</field><field name="property">time</field><statement name="actions"><block type="tank_moveForward"><next><block type="tank_turnLeft"></block></next></block></statement></block></next></block></statement></block></statement></block></xml>';
    } else if ($_GET['level'] == 5) {
        $enemiesCount = 20;//set enemies number
        $data = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="agent" x="13" y="37"><field name="agentType">0</field><statement name="nodes"><block type="tank_NearestEnemy"><next><block type="tank_turnToAngle_1"><value name="angle"><shadow type="math_number"><field name="NUM">67</field></shadow><block type="tank_NearestEnemyDirectionAngle"></block></value><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="tank_NearestEnemyDistance"></block></value><value name="B"><block type="math_number"><field name="NUM">200</field></block></value></block></value><statement name="DO0"><block type="tank_fireAtAngle_1"><value name="angle"><shadow type="math_number"><field name="NUM">67</field></shadow><block type="tank_NearestEnemyDirectionAngle"></block></value></block></statement><statement name="ELSE"><block type="tank_moveForward"></block></statement></block></next></block></next></block></statement></block></xml>';
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="google" value="notranslate">
    <title>Blockly Demo:</title>
    <link rel="stylesheet" href="style.css">
    <script src="storage.js"></script>
    <script src="blockly/blockly_compressed.js"></script>
    <script src="blockly/blocks_compressed.js"></script>
    <script src="blockly/javascript_compressed.js"></script>
    <script src="blockly/python_compressed.js"></script>
    <script src="blockly/php_compressed.js"></script>
    <script src="blockly/dart_compressed.js"></script>
    <script src="code.js"></script>
    <script src="blocks.js"></script>
    <meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0 minimal-ui"/>
    <script src="plugin/js/jquery-2.0.3.min.js" type="text/javascript"></script>
    <script src="plugin/phaser/phaser.<?php echo $v ?>.min.js" type="text/javascript"></script>
    <script src="plugin/phaser/blob.js" type="text/javascript"></script>
    <script src="plugin/phaser/canvas-to-blob.js" type="text/javascript"></script>
    <script src="plugin/phaser/filesaver.js" type="text/javascript"></script>
<!--    <script src="plugin/phaser/--><?php //echo $embedJS ?><!--" type="text/javascript"></script>-->
    <script src="games/tanks.js" type="text/javascript"></script>

    <script src="behaviac.js" type="text/javascript"></script>
    <style>
        body {
            margin: 0px;
            padding: 0px;
            font-family: Arial;
            font-size: 14px;
            /*background-color: #000000;*/
            /*color: #fff;*/
        }
    </style>

    <script>

        agents = [];
        function loadData() {
            if (localStorage.data) {
                localStorage.data = '<?=$data?>';
            } else {
                localStorage.setItem('data', '<?=$data?>');
            }
        }
        function btexe() {
            var len = agents.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    try {
                        eval(agents[i] + "()");
                    } catch (e) {
                        alert(MSG['badCode'].replace('%1', e));
                    }
                }
            }
        }

    </script>
</head>
<body onload="loadData()">
<table width="100%" height="100%">
    <tr>
        <td width="50%">
            <table width="100%" height="100%">
                <tr>
                    <td>
                        <h1><a href="//www.behaviac.com">Behaviac</a>&rlm; &gt;
                            <a href="#">Demos</a>&rlm; &gt;
                            <span id="title">...</span>
                        </h1>
                    </td>
                    <td class="farSide">
                        <select id="languageMenu"></select>
                    </td>
                </tr>
                <tr>
                    <td colspan=2>
                        <table width="100%">
                            <tr id="tabRow" height="1em">
                                <td id="tab_blocks" class="tabon">...</td>
                                <td class="tabmin">&nbsp;</td>
                                <td id="tab_javascript" class="taboff">JavaScript</td>
                                <td class="tabmin">&nbsp;</td>
                                <td id="tab_python" class="taboff">Python</td>
                                <td class="tabmin">&nbsp;</td>
                                <td id="tab_php" class="taboff">PHP</td>
                                <td class="tabmin">&nbsp;</td>
                                <td id="tab_dart" class="taboff">Dart</td>
                                <td class="tabmin">&nbsp;</td>
                                <td id="tab_xml" class="taboff">XML</td>
                                <td class="tabmax">
                                    <button id="btnStore" class="notext" title="...">保存</button>
                                    <button id="btnRestore" class="notext" title="...">读取</button>

                                    <button id="trashButton" class="notext" title="...">
                                        <img src='media/1x1.gif' class="trash icon21">
                                    </button>
                                    <button id="linkButton" class="notext" title="...">
                                        <img src='media/1x1.gif' class="link icon21">
                                    </button>
                                    <button id="runButton" class="notext primary" title="...">
                                        <img src='media/1x1.gif' class="run icon21">
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="99%" colspan=2 id="content_area">
                    </td>
                </tr>
            </table>
        </td>
        <td width="50%">
            <div id="phaser-example"></div>

            <script type="text/javascript">

                var IDE_HOOK = false;
                var VERSION = '<?php echo $v ?>';

                var enemiesTotal = <?=$enemiesCount?>;

            </script>
        </td>
    </tr>
</table>

<div id="content_blocks" class="content"></div>
<pre id="content_javascript" class="content"></pre>
<pre id="content_php" class="content"></pre>
<pre id="content_python" class="content"></pre>
<pre id="content_dart" class="content"></pre>
<textarea id="content_xml" class="content" wrap="off"></textarea>

<xml id="toolbox" style="display: none">
    <category id="catLogic" colour="210">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
        <block type="logic_null"></block>
        <block type="logic_ternary"></block>
    </category>
    <category id="catLoops" colour="120">
        <block type="controls_repeat_ext">
            <value name="TIMES">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="loop_topdown">
            <value name="times">
                <shadow type="math_number">
                    <field name="NUM">-1</field>
                </shadow>
            </value>
        </block>
        <block type="controls_whileUntil"></block>
        <block type="controls_for">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
            <value name="BY">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="controls_forEach"></block>
        <block type="controls_flow_statements"></block>
    </category>
    <category id="catMath" colour="230">
        <block type="math_number"></block>
        <block type="math_arithmetic">
            <value name="A">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="B">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="math_single">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">9</field>
                </shadow>
            </value>
        </block>
        <block type="math_trig">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">45</field>
                </shadow>
            </value>
        </block>
        <block type="math_constant"></block>
        <block type="math_number_property">
            <value name="NUMBER_TO_CHECK">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="math_change">
            <value name="DELTA">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="math_round">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">3.1</field>
                </shadow>
            </value>
        </block>
        <block type="math_on_list"></block>
        <block type="math_modulo">
            <value name="DIVIDEND">
                <shadow type="math_number">
                    <field name="NUM">64</field>
                </shadow>
            </value>
            <value name="DIVISOR">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="math_constrain">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="LOW">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="HIGH">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="math_random_int">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="math_random_float"></block>
    </category>
    <category id="catText" colour="160">
        <block type="text"></block>
        <block type="text_join"></block>
        <block type="text_append">
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="text_length">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_isEmpty">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="text_indexOf">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">text</field>
                </block>
            </value>
            <value name="FIND">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_charAt">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">text</field>
                </block>
            </value>
        </block>
        <block type="text_getSubstring">
            <value name="STRING">
                <block type="variables_get">
                    <field name="VAR">text</field>
                </block>
            </value>
        </block>
        <block type="text_changeCase">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_trim">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_print">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_prompt_ext">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
    </category>
    <category id="catLists" colour="260">
        <block type="lists_create_with">
            <mutation items="0"></mutation>
        </block>
        <block type="lists_create_with"></block>
        <block type="lists_repeat">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
        </block>
        <block type="lists_length"></block>
        <block type="lists_isEmpty"></block>
        <block type="lists_indexOf">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_getIndex">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_setIndex">
            <value name="LIST">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_getSublist">
            <value name="LIST">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_split">
            <value name="DELIM">
                <shadow type="text">
                    <field name="TEXT">,</field>
                </shadow>
            </value>
        </block>
    </category>
    <category id="catColour" colour="20">
        <block type="colour_picker"></block>
        <block type="colour_random"></block>
        <block type="colour_rgb">
            <value name="RED">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
            <value name="GREEN">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="BLUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="colour_blend">
            <value name="COLOUR1">
                <shadow type="colour_picker">
                    <field name="COLOUR">#ff0000</field>
                </shadow>
            </value>
            <value name="COLOUR2">
                <shadow type="colour_picker">
                    <field name="COLOUR">#3333ff</field>
                </shadow>
            </value>
            <value name="RATIO">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
        </block>
    </category>
    <sep></sep>
    <category id="catVariables" colour="330" custom="VARIABLE"></category>
    <category id="catFunctions" colour="290" custom="PROCEDURE"></category>
    <sep></sep>
    <category name="Behaviac" colour="330">
        <category name="Agent">
            <block type="agent"></block>
        </category>
        <category name="Attachments">
            <block type="preaction_topdown"></block>
            <block type="preaction_left"></block>
            <block type="postaction_topdown"></block>
            <block type="postaction_left"></block>
        </category>
        <category name="Sequence">
            <block type="sequence_topdown"></block>
        </category>
        <category name="Selector">
            <block type="selector_topdown"></block>
        </category>
        <category name="Condition">
            <block type="condition_left"></block>
            <block type="condition_topdown"></block>
        </category>
        <category name="Action">
            <block type="action_topdown"></block>
            <block type="action_left"></block>
            <block type="noop_left"></block>
            <block type="noop_topdown"></block>
            <block type="wait_left"></block>
            <block type="wait_topdown"></block>

        </category>
        <category name="Composites">
            <category name="Parallel">
                <block type="parallel_topdown"></block>
            </category>
        </category>
        <category name="eventHanding">
            <block type="withpecondition_topdown"></block>
            <block type="selectormonitor_topdown">
                <value name="WAITFORSIGNAL">
                    <block type="waitforsignal_topdown">
                        <next>
                            <block type="waitforsignal_topdown"></block>
                        </next>
                    </block>

                </value>

            </block>
            <block type="waitforsignal_topdown"></block>
        </category>
        <category name="Log">
            <block type="log_topdown">
                <value name="TEXT">
                    <block type="text">
                        <field name="TEXT">I Love Behaviac!</field>
                    </block>
                </value>
            </block>
            <block type="log_left">
                <value name="TEXT">
                    <block type="text">
                        <field name="TEXT">I Love Behaviac!</field>
                    </block>
                </value>
            </block>
        </category>
    </category>
    <category name="Agent" colour="180">
        <block type="agent"></block>
        <category name="Tank" colour="220">
            <block type="tank_moveForward">
            </block>
            <block type="tank_turnLeft">
            </block>
            <block type="tank_turnRight">
            </block>
            <block type="tank_backward">
            </block>
            <block type="tank_turnToNorth">
            </block>
            <block type="tank_turnToSouth">
            </block>

            <block type="tank_turnToEast">
            </block>
            <block type="tank_turnToWest">
            </block>
            <block type="tank_fire">
            </block>
            <block type="tank_turnToAngle">
            </block>
            <block type="tank_fireAtAngle">
            </block>
            <block type="tank_fireAtAngle_1">
                <value name="angle">
                    <shadow type="math_number">
                        <field name="NUM">67</field>
                    </shadow>
                </value>
            </block>
            <block type="tank_turnToAngle_1">
                <value name="angle">
                    <shadow type="math_number">
                        <field name="NUM">67</field>
                    </shadow>
                </value>
            </block>
            <block type="tank_fireAt">
                <value name="radian">
                    <shadow type="math_number">
                        <field name="NUM">3.14</field>
                    </shadow>
                </value>
            </block>
            <block type="tank_NearestEnemyDirectionAngle">
            </block>
            <block type="tank_NearestEnemyDistance">
            </block>
            <block type="tank_NearestEnemy">
            </block>

        </category>
    </category>

</xml>

</body>
</html>
