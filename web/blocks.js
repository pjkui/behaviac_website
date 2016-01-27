/**
 *
 *     @author QuinnPan<quinnpan@tencent.com>
 *     @date 2016年1月5日11:49:28
 *     @description This File to register blocks for behaviac editor
 */

Blockly.Blocks['agent'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["tank", "0"]]), "agentType");
        this.appendStatementInput("nodes")
            .setCheck("agent");

        this.setInputsInline(true);
        this.setColour(285);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['agent'] = function (block) {
    var dropdown_agenttype = block.getFieldValue('agentType');
    var statements_nodes = Blockly.JavaScript.statementToCode(block, 'nodes');
    // TODO: Assemble JavaScript into code variable.
    var code = "agent_" + dropdown_agenttype + "= function(){\n" + statements_nodes + "}\n";
    return code;
};

//add  preAction
Blockly.Blocks['preaction_topdown'] = {
    init: function () {
        this.appendValueInput("preAction")
            .setCheck("Boolean")
            .appendField("PreAction");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true, "Boolean");
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['preaction_topdown'] = function (block) {
    var value_preaction = Blockly.JavaScript.valueToCode(block, 'preAction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "console.log('precondition doing');\n";
    return code;
};
Blockly.Blocks['preaction_left'] = {
    init: function () {
        this.appendValueInput("preAction")
            .setCheck("Boolean")
            .appendField("PreAction");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['preaction_left'] = function (block) {
    var value_preaction = Blockly.JavaScript.valueToCode(block, 'preAction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "console.log('precondition doing');\n";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

//add postaction
Blockly.Blocks['postaction_topdown'] = {
    init: function () {
        this.appendValueInput("postAction")
            .setCheck("Boolean")
            .appendField("PostAction");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true, "Boolean");
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['postaction_topdown'] = function (block) {
    var value_postaction = Blockly.JavaScript.valueToCode(block, 'postAction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "console.log('postaction_topdown doing');\n";
    return code;
};

Blockly.Blocks['postaction_left'] = {
    init: function () {
        this.appendValueInput("action")
            .setCheck("Boolean")
            .appendField("PostAction");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['postaction_left'] = function (block) {
    var value_postaction = Blockly.JavaScript.valueToCode(block, 'postAction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "console.log('postaction_topdown doing');\n";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['action_topdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("动作")
            .appendField(new Blockly.FieldDropdown([["option", "OPTIONNAME"], ["option", "OPTIONNAME"], ["option", "OPTIONNAME"]]), "NAME");
        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['action_topdown'] = function (block) {
    var code = "console.log('action_topdown doing');\n";
    return code;
};
Blockly.Blocks['action_left'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("动作")
            .appendField(new Blockly.FieldDropdown([["option", "OPTIONNAME"], ["option", "OPTIONNAME"], ["option", "OPTIONNAME"]]), "NAME");
        this.setInputsInline(false);
        this.setOutput(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['action_left'] = function (block) {
    var code = "console.log('action_left doing');\n";
    return [code, Blockly.JavaScript.ORDER_NONE];
};
//Noop
Blockly.Blocks['noop_topdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Noop");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['noop_topdown'] = function (block) {
    var code = "console.log('noop_topdown doing');\n";
    return code;
};

Blockly.Blocks['noop_left'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Noop");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['noop_left'] = function (block) {
    var code = "console.log('noop_left doing');\n";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

//Wait
Blockly.Blocks['wait_left'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldTextInput("100"), "times")
            .appendField(":")
            .appendField(new Blockly.FieldDropdown([["毫秒", "time"], ["帧", "frame"]]), "property");
        this.appendStatementInput("actions");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        this.setColour(100);
    }
};

Blockly.JavaScript['wait_left'] = function (block) {
    var text_times = block.getFieldValue('times');
    var dropdown_property = block.getFieldValue('property');
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'actions');
    // TODO: Assemble JavaScript into code variable.
    var code = "console.log('wait_left doing');\n" + "{\n" + statements_actions + "}\n";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['wait_topdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldTextInput("100"), "times")
            .appendField(":")
            .appendField(new Blockly.FieldDropdown([["毫秒", "time"], ["帧", "frame"]]), "property");
        this.appendStatementInput("actions");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        this.setColour(100);
    }
};
Blockly.JavaScript['wait_topdown'] = function (block) {
    var text_times = block.getFieldValue('times');
    var dropdown_property = block.getFieldValue('property');
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'actions');
    var unit = dropdown_property == "time" ? 1 : 20;
    //debugger;
    // TODO: Assemble JavaScript into code variable.
    var code = 'if(!behaviac.checkWaitSequence(' + block.id + ')){\n' +
        'behaviac.waitSequence.push(' + block.id + ');\n' +
        'setTimeout(function(){\n'
        + statements_actions +
        'behaviac.waitSequence.remove(' + block.id + ')' +
        '},' + text_times * unit + ');\n}\n';
    //var code = "console.log('action_topdown doing');\n{\n" + statements_actions + "}\n";
    return code;
};


//Parallel
Blockly.Blocks['selector_topdown'] = {
    init: function () {
        this.appendStatementInput("actions")
            .appendField(new Blockly.FieldDropdown([["Selector", "0"], ["SelectorStochastic", "1"], ["SelectorProbability", "2"]]), "type");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('hello');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['action_topdown'] = function (block) {
    var argument = Blockly.JavaScript.valueToCode(block, "actions", Blockly.JavaScript.ORDER_NONE);
    var code = "console.log('action_topdown doing');\n" + "{\n" + argument + "}\n";
    return code;
};

//Sequence
Blockly.Blocks['sequence_topdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["Sequence", "0"], ["SequenceStochastic", "1"]]), "type");
        this.appendStatementInput("actions");

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['sequence_topdown'] = function (block) {
    var dropdown_type = block.getFieldValue('type');
    //var statements_actions = Blockly.JavaScript.statementToCode(block, 'actions');
    var targetBlock = block.getInputTargetBlock("actions");
    var code = "";
    while (targetBlock) {
        code += Blockly.JavaScript.currentBlockToCode(targetBlock);
        targetBlock = targetBlock.getNextBlock();
    }
    //var code = "console.log('action_topdown doing. type:" + dropdown_type + "');\n" +
    //    "{\n" + statements_actions + "}\n";
    return code;
};

//Parallel
Blockly.Blocks['parallel_topdown'] = {
    init: function () {
        this.appendStatementInput("actions")
            .appendField("Parallel");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(290);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['parallel_topdown'] = function (block) {
    var argument = Blockly.JavaScript.statementToCode(block, "actions");
    var code = "console.log('parallel_topdown doing');\n" +
        "{\n" + argument + "}\n";
    return code;
};

//this.appendStatementInput('STACK');
Blockly.Blocks['withpecondition_topdown'] = {
    init: function () {
        this.appendValueInput("precondition")
            .appendField("preCondition");
        this.appendStatementInput("actions")
            .appendField("Action");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['withpecondition_topdown'] = function (block) {
    var value_precondition = Blockly.JavaScript.valueToCode(block, 'precondition', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'actions');
    var code = "console.log('withpecondition_topdown doing');\n" +
        "{\n" + value_precondition + "\n"
        + statements_actions + "}\n";
    return code;
};

Blockly.Blocks['waitforsignal_topdown'] = {
    init: function () {
        this.appendValueInput("signal")
            .appendField("Signal");
        this.appendStatementInput("actions")
            .appendField("Action");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['waitforsignal_topdown'] = function (block) {
    var precondition = Blockly.JavaScript.valueToCode(block, "signal", Blockly.JavaScript.ORDER_ATOMIC);
    var argument = Blockly.JavaScript.statementToCode(block, "actions");
    var code = "console.log('waitforsignal_topdown doing');\n" +
        "{\n" + precondition + "\n"
        + argument + "}\n";
    return code;
};

//SelecotrMonitor
Blockly.Blocks['selectormonitor_topdown'] = {
    init: function () {
        this.appendStatementInput("WAITFORSIGNAL")
            .setCheck("Array")
            .appendField("SelectorMonitor");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['selectormonitor_topdown'] = function (block) {
    var argument = Blockly.JavaScript.statementToCode(block, "WAITFORSIGNAL");
    var code = "console.log('selectormonitor_topdown doing');\n" +
        "{\n" + argument + "}\n";
    return code;
};

Blockly.Blocks['condition_left'] = {
    init: function () {
        this.appendValueInput("left");
        this.appendDummyInput("opt")
            .appendField(new Blockly.FieldDropdown([["==", "=="], ["!=", "!="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="]]), "opt");
        this.appendValueInput("right");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['condition_left'] = function (block) {
    var value_left = Blockly.JavaScript.valueToCode(block, 'left', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_opt = block.getFieldValue('opt');
    var value_right = Blockly.JavaScript.valueToCode(block, 'right', Blockly.JavaScript.ORDER_ATOMIC);

    var code = "console.log('condition_left doing');\n" +
        "if (" + value_left + " " + dropdown_opt + "  " + value_right + "){\n" +
        "\treturn true;\n" +
        "}\n" +
        "else{\n" +
        "return false;\n" +
        "}\n";
    return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.Blocks['condition_topdown'] = {
    init: function () {
        this.appendValueInput("right");
        this.appendDummyInput("opt")
            .appendField(new Blockly.FieldDropdown([["==", "=="], ["!=", "!="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="]]), "opt");
        this.appendValueInput("left");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['condition_topdown'] = function (block) {
    var right = Blockly.JavaScript.valueToCode(block, "right", Blockly.JavaScript.ORDER_ATOMIC);
    var operator = block.getFieldValue('opt');
    var left = Blockly.JavaScript.valueToCode(block, "left", Blockly.JavaScript.ORDER_ATOMIC);
    var code = "console.log('condition_topdown doing');\n" +
        "if (" + right + " " + operator + "  " + left + "){\n" +
        "return true;\n" +
        "}\n" +
        "else{\n" +
        "return false;\n" +
        "}\n";
    return code;
};


Blockly.Blocks['log_topdown'] = {
    init: function () {
        this.appendValueInput("TEXT")
            .appendField("Log");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['log_topdown'] = function (block) {
    var text = Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_ATOMIC);
    var code = "console.log(" + text + ");\n";
    return code;
};

Blockly.Blocks['log_left'] = {
    init: function () {
        this.appendValueInput("TEXT")
            .appendField("Log");
        this.setOutput(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['log_left'] = function (block) {
    var text = Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_ATOMIC);
    var code = "console.log(" + text + ");\n";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

//Countlimit
Blockly.Blocks['loop_topdown'] = {
    init: function () {
        this.appendValueInput("times")
            .setCheck("Number")
            .appendField(new Blockly.FieldDropdown([["LoopUntil", "0"], ["FailureUntil", "1"], ["SuccessUntil", "2"], ["CountLimit", "3"]]), "type");
        this.appendDummyInput()
            .appendField("times");
        this.appendStatementInput("child");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['loop_topdown'] = function (block) {
    var dropdown_type = block.getFieldValue('type');
    var value_times = Blockly.JavaScript.valueToCode(block, 'times', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_child = Blockly.JavaScript.statementToCode(block, 'child');
    // TODO: Assemble JavaScript into code variable.
    var code = "console.log('loop_topdown doing');\n";
    code += "for(var i=0;i<" + value_times + ";i++){\n" +
        statements_child +
        "}\n"
    return code;
};

//Agent

Blockly.Blocks['tank_moveForward'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("moveForward()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_moveForward'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'moveForward();\n';
    return code;
};

Blockly.Blocks['tank_turnLeft'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnLeft()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_turnLeft'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnLeft();\n';
    return code;
};

Blockly.Blocks['tank_turnRight'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnRight()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_turnRight'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnRight();\n';
    return code;
};

Blockly.Blocks['tank_backward'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("backward()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_backward'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'backward();\n';
    return code;
};
Blockly.Blocks['tank_turnToAngle'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnToAngle(")
            .appendField(new Blockly.FieldAngle(90), "angle")
            .appendField(")");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_turnToAngle'] = function (block) {
    var angle_angle = block.getFieldValue('angle');
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnToAngle(-' + angle_angle + ');\n';
    return code;
};
Blockly.Blocks['tank_turnToNorth'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnToNorth()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_turnToNorth'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnToNorth();\n';
    return code;
};

Blockly.Blocks['tank_turnToSouth'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnToSouth()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_turnToSouth'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnToSouth();\n';
    return code;
};


Blockly.Blocks['tank_turnToEast'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnToEast()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_turnToEast'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnToEast();\n';
    return code;
};
Blockly.Blocks['tank_turnToWest'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnToWest()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_turnToWest'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnToWest();\n';
    return code;
};
Blockly.Blocks['tank_fire'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("fire()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_fire'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fire();\n';
    return code;
};


Blockly.Blocks['tank_fireAtAngle'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("fireAtAngle(")
            .appendField(new Blockly.FieldAngle(90), "angle")
            .appendField(")");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['tank_fireAtAngle'] = function (block) {
    var angle_angle = block.getFieldValue('angle');
    // TODO: Assemble JavaScript into code variable.
    var code = 'fireAtAngle(-' + angle_angle + ');\n';
    return code;
};
Blockly.Blocks['tank_fireAtAngle_1'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("fireAtAngle(");
        this.appendValueInput("angle");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['tank_fireAtAngle_1'] = function (block) {
    var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'fireAtAngle(' + value_angle + ');\n';
    return code;
};

Blockly.Blocks['tank_turnToAngle_1'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("turnToAngle(");
        this.appendValueInput("angle");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['tank_turnToAngle_1'] = function (block) {
    var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'turnToAngle' + value_angle + ';\n';
    return code;
};

Blockly.Blocks['tank_fireAt'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("fireAt(");
        this.appendValueInput("radian");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['tank_fireAt'] = function (block) {
    var value_radian = Blockly.JavaScript.valueToCode(block, 'radian', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'fireAt(-' + value_radian + ');\n';
    return code;
};

Blockly.Blocks['tank_NearestEnemyDirectionAngle'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("getNearestEnemyDirectionAngle()");
        this.setOutput(true);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['tank_NearestEnemyDirectionAngle'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'getNearestEnemyDirectionAngle()';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['tank_NearestEnemyDistance'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("getNearestEnemyDistance()");
        this.setOutput(true);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['tank_NearestEnemyDistance'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'getNearestEnemyDistance()';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['tank_NearestEnemy'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("getNearestEnemy()");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.JavaScript['tank_NearestEnemy'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'getNearestEnemy();\n';
    // TODO: Change ORDER_NONE to the correct strength.
    return code;
};