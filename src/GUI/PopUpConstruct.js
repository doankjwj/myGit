var PopUpConstruct = cc.Node.extend({
    _constructType: null,
    _buildingId: null,

    _bg: null,
    _titleBar: null,
    _txtTitle: null,
    _btnClose: null,
    _btnOk: null,

    //Training Barrack
    _trainingQueueBackground: null,
    _queueArrow: null,
    _timeTraining: null,
    _previousBarrack: null,
    _nextBarrack: null,
    _numberOfTroops: null,
    _textTime: null,
    _textTimeLabel: null,
    _textQuickFinish: null,
    _quickFinishButton: null,
    _statusText: null,

    _swallowTouch: null,

    _uprgradeAble: null,

    _icon: null,
    _grass: null,
    _effect: null,
    _timeRequireTXT: null,

    /* Hp bar */
    _bar1: null,
    _bar1BG: null,
    _bar1TXT: null,
    _bar1Icon: null,

    /* Orther bar -Option */
    _bar2: null,
    _bar2BG: null,
    _bar2TXT: null,
    _bar2Icon: null,

    _bar3: null,
    _bar3BG: null,
    _bar3TXT: null,
    _bar3Icon: null,



    _cost: {
        gold: 0,
        elixir: 0,
        darkElixir: 0,
        coin: 0
    },

    _bgScale: 2.5,
    _offSetBar : 50,
    _colorBG: null,

    _TAG_ICON: 1122,
    _TAG_GRASS: 3331,
    _TAG_EFFECT: 4512,
    _TAG_TITLE: 9471,

    _TAG_BAR1_ICON: 2321,
    _TAG_BAR1: 9342,
    _TAG_BAR1_TXT: 2323,
    _TAG_BAR1_BG: 8273,
    _TAG_BAR2_ICON: 2423,
    _TAG_BAR2: 4353,
    _TAG_BAR2_TXT: 7578,
    _TAG_BAR2_BG: 7252,
    _TAG_BAR3_ICON: 4535,
    _TAG_BAR3: 8975,
    _TAG_BAR3_TXT: 6432,
    _TAG_BAR3_BG: 3453,

    _orderBar: {
        bar1: 0,
        bar2: 1,
        bar3: 2
    },

    _TAG_TXT_TIME_REQUIRE: 9966,
    _TAG_CONTENT_REQUIRE: 8766,

    ctor: function()
    {
        this._super();
        var self = this;

        //cc.log("++Pop Up Construct init");
        /* Background */
        this._bg = cc.Sprite(res.popUp.bg);
        this._bg.setAnchorPoint(cc.p(0.5, 0.5));
        this._bg.setPosition(cc.p(0, 0));
        this._bg.scale = this._bgScale;
        this.addChild(this._bg, 0);

        this._colorBG = cc.LayerColor(cc.color(127.5,127.5,127.5,0));
        this._colorBG.width = cc.winSize.width;
        this._colorBG.height = cc.winSize.height;
        this._colorBG.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(this._colorBG, -1);
        this.addTouchListener();

        //cc.log("++Color Bg");
        /* Text Title */
        this._txtTitle = cc.LabelBMFont("Building Title", font.soji20);
        this._txtTitle.setAnchorPoint(cc.p(0.5, 0.5));
        this._txtTitle.setPosition(cc.p(0, this._bg.height / 2 * this._bgScale - this._txtTitle.height));
        this.addChild(this._txtTitle, 1, this._TAG_TITLE);

        /* Button Close */
        this._btnClose = ccui.Button(res.popUp.btnClose, res.popUp.btnClose);
        this._btnClose.setAnchorPoint(cc.p(0.5, 0.5));
        this._btnClose.scale = this._bgScale * 0.75;
        this._btnClose.setPosition(cc.p(this._bg.width*this._bgScale/2 - this._btnClose.width*this._btnClose.scale/1.5, this._bg.height*this._bgScale/2 - this._btnClose.height  *this._btnClose.scale/1.5));
        this.addChild(this._btnClose, 1);
        this._btnClose.addClickEventListener(function(){
            self.setPosition(cc.p(0, - cc.winSize.height));
            self.onDisappear();
        });

        /* Button Ok */
        this._btnOk = ccui.Button(res.popUp.btnOk, res.popUp.btnOk);
        this._btnOk.setAnchorPoint(cc.p(0.5, 0.5));
        this._btnOk.scale = 1;
        this._btnOk.setPosition(cc.p(0, -this._bg.height*this._bgScale/2 + this._btnOk.height *this._btnOk.scale/2 + 50));
        // this._btnOk.setTextureName("Ok");
        this.addChild(this._btnOk, 1);

        //cc.log("++ Button close Added");
        this._btnOk.addTouchEventListener(function(sender, type) {
            var cheatNumber = 5000;
            switch (type){
                case ccui.Widget.TOUCH_BEGAN:
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    self.setPosition(cc.p(0, - cc.winSize.height));
                    if (!gv.upgradeAble)
                    {
                        self.getParent().popUpMessage("Chưa đủ tài nguyên");
                        return;
                    };
                    if (cf.user._builderFree <= 0)
                    {
                        self.getParent().popUpMessage("Tất cả thợ đang bận");
                        return;
                    }

                    //cc.log("Upgrade");
                    self.onDisappear();
                    cf.user._buildingList[Math.floor(gv.building_selected/100)-1][Math.floor(gv.building_selected % 100)].onStartBuild(gv.startConstructType.newConstruct);
                    /* Request */
                    testnetwork.connector.sendUpgradeBuilding(gv.building_selected);

                    /* Update User Infor + Resource Bar */
                    cf.user._currentCapacityGold -= self._cost.gold;
                    cf.user._currentCapacityElixir -= self._cost.elixir;
                    cf.user._currentCapacityDarkElixir -= self._cost.darkElixir;
                    cf.user._currentCapacityCoin -= self._cost.coin;

                    //cc.log("Update User Info 1");
                    self.getParent().getChildByTag(gv.tag.TAG_RESOURCE_BAR_GOLD).updateStatus();
                    //cc.log("Update User Info 2");
                    self.getParent().getChildByTag(gv.tag.TAG_RESOURCE_BAR_ELIXIR).updateStatus();
                    //cc.log("Update User Info 3");
                    self.getParent().getChildByTag(gv.tag.TAG_RESOURCE_BAR_DARK_ELIXIR).updateStatus();
                    //cc.log("Update User Info 4");
                    self.getParent().getChildByTag(gv.tag.TAG_RESOURCE_BAR_COIN).updateStatus();
                    //cc.log("Update User Info 5");
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
            }
        }, this._btnOk);


        /* Building Icon */
        this._icon = cc.Sprite(res.tmp_effect);
        this._icon.setAnchorPoint(cc.p(0.5, 0.5));
        this._icon.setPosition(- this._bg.width * this._bgScale / 4, this._bg.height * this._bgScale / 8);
        this.addChild(this._icon, 2, this._TAG_ICON);

        //cc.log("++ Building Icon");
        /* Time Require */
        this._timeRequireTXT = cc.LabelBMFont("10d23h", font.soji20);
        this._timeRequireTXT.setAnchorPoint(cc.p(0.5, 1));
        this._timeRequireTXT.setPosition(cc.p(this._icon.x, this._icon.y - this._timeRequireTXT.height * 3));
        this._timeRequireTXT.visible = false;
        this.addChild(this._timeRequireTXT, 2, this._TAG_TXT_TIME_REQUIRE);

        //cc.log("++ TXT time require");
        /* Building Grass */
        this._grass = cc.Sprite(res.tmp_effect);
        this._grass.setAnchorPoint(cc.p(0.5, 0.5));
        this._grass.setPosition(- this._bg.width * this._bgScale / 4, this._bg.height * this._bgScale / 8);
        this.addChild(this._grass, 1, this._TAG_GRASS);

        //cc.log("++ Grass");
        /* Builing Effect */
        this._effect = cc.Sprite(res.tmp_effect);
        this._effect.setAnchorPoint(cc.p(0.5, 0.5));
        this._effect.setPosition(- this._bg.width * this._bgScale / 4, this._bg.height * this._bgScale / 8);
        this.addChild(this._effect, 3, this._TAG_EFFECT);

        this.addBars();

        this.initTrainingLayer();

        //cc.log("++ HP TXT");
    },

    initTrainingLayer: function() {

        // _trainingQueueBackground: null,
        //     _queueArrow: null,
        //     _timeTraining: null,
        //     _previousBarrack: null,
        //     _nextBarrack: null,
        //     _numberOfTroops: null,
        //     _textTime: null,
        //     _textTimeLabel: null,
        //     _textQuickFinish: null,
        //     _quickFinishButton: null,
        //     _statusText: null,
        //the white one
        this._trainingQueueBackground = cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(this._trainingQueueBackground, 1);
        this._trainingQueueBackground.width = this._bg.width*this._bg.scale*0.9;
        this._trainingQueueBackground.height = this._bg.height/4*this._bg.scale;
        this._trainingQueueBackground.x = -this._bg.width/2*this._bg.scale*0.9;
        this._trainingQueueBackground.y = this._bg.height/12*this._bg.scale;
        this._trainingQueueBackground.visible = false;

        //the green arrow

        this._queueArrow = cc.Sprite()


    },

    showTrainingLayer: function() {
        this._trainingQueueBackground.visible = true;
    },

    addBars: function()
    {

        // +++++ BAR 1 ===============================================
        /* HP Bar BG */
        this._bar1BG = cc.Sprite(res.upgradeBuildingGUI.infoBarBG);
        this._bar1BG.attr({
            anchorX: 0,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: 0.5 * this._bg.height * this._bgScale / 2
        });
        this.addChild(this._bar1BG, 2, this._TAG_BAR1_BG);

        //cc.log("++ HP Bar BG");
        /* Hp Bar */
        this._bar1 = cc.Sprite(res.upgradeBuildingGUI.infoBar);
        this._bar1.attr({
            anchorX: 0,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: 0.5 * this._bg.height * this._bgScale / 2
        });
        this.addChild(this._bar1, 2, this._TAG_BAR1);

        //cc.log("++ HP Bar BG");
        /* Hp Icon */
        this._bar1Icon = cc.Sprite(res.upgradeBuildingGUI.hpIcon);
        this._bar1Icon.attr({
            anchorX: 1,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: 0.5 * this._bg.height * this._bgScale / 2
        });
        this.addChild(this._bar1Icon, 2);

        //cc.log("++ HP Icon");
        /* Hp TXT */
        this._bar1TXT = cc.LabelBMFont("Bar 1 Info", font.soji20);
        this._bar1TXT.attr({
            anchorX:0.5,
            anchorY: 0,
            x: this._bar1BG.x + this._bar1.width/2,
            y: this._bar1BG.y
        });
        this.addChild(this._bar1TXT, 2, this._TAG_BAR1_TXT);
        //cc.log("++ HP TXT");

        // +++++ BAR 2 =============================================
        /* HP Bar BG */
        this._bar2BG = cc.Sprite(res.upgradeBuildingGUI.infoBarBG);
        this._bar2BG.attr({
            anchorX: 0,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: this._bar1BG.y - this._offSetBar,
        });
        this.addChild(this._bar2BG, 2, this._TAG_BAR2_BG);


        //cc.log("++ HP Bar BG");
        /* Hp Bar */
        this._bar2 = cc.Sprite(res.upgradeBuildingGUI.infoBar);
        this._bar2.attr({
            anchorX: 0,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: this._bar1BG.y - this._offSetBar,
        });
        this.addChild(this._bar2, 2, this._TAG_BAR2);

        //cc.log("++ HP Bar BG");
        /* Hp Icon */
        this._bar2Icon = cc.Sprite(res.upgradeBuildingGUI.hpIcon);
        this._bar2Icon.attr({
            anchorX: 1,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: this._bar1BG.y - this._offSetBar,
        });
        this.addChild(this._bar2Icon, 2);

        //cc.log("++ HP Icon");
        /* Hp TXT */
        this._bar2TXT = cc.LabelBMFont("Bar 2 Info", font.soji20);
        this._bar2TXT.attr({
            anchorX:0.5,
            anchorY: 0,
            x: this._bar2BG.x + this._bar2.width/2,
            y: this._bar2BG.y
        });
        this.addChild(this._bar2TXT, 2, this._TAG_BAR2_TXT);
        //cc.log("++ HP TXT");

        // +++++ Bar 3 ==============================================
        /* HP Bar BG */
        this._bar3BG = cc.Sprite(res.upgradeBuildingGUI.infoBarBG);
        this._bar3BG.attr({
            anchorX: 0,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: this._bar1BG.y - this._offSetBar * 2,
        });
        this.addChild(this._bar3BG, 2, this._TAG_BAR3_BG);


        //cc.log("++ HP Bar BG");
        /* Hp Bar */
        this._bar3 = cc.Sprite(res.upgradeBuildingGUI.infoBar);
        this._bar3.attr({
            anchorX: 0,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: this._bar1BG.y - this._offSetBar * 2,
        });
        this.addChild(this._bar3, 2, this._TAG_BAR3);

        //cc.log("++ HP Bar BG");
        /* Hp Icon */
        this._bar3Icon = cc.Sprite(res.upgradeBuildingGUI.hpIcon);
        this._bar3Icon.attr({
            anchorX: 1,
            anchorY: 0.5,
            x: 0.5 * this._bg.height * this._bgScale / 10,
            y: this._bar1BG.y - this._offSetBar * 2,
        });
        this.addChild(this._bar3Icon, 2);

        //cc.log("++ HP Icon");
        /* Hp TXT */
        this._bar3TXT = cc.LabelBMFont("Bar 3 Info", font.soji20);
        this._bar3TXT.attr({
            anchorX:0.5,
            anchorY: 0,
            x: this._bar3BG.x + this._bar3.width/2,
            y: this._bar3BG.y
        });
        this.addChild(this._bar3TXT, 2, this._TAG_BAR3_TXT);
    },

    addTouchListener: function () {
        var self = this;
        this._swallowTouch = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                return true;
            }
        });
        this._swallowTouch.setEnabled(false);
        cc.eventManager.addListener(this._swallowTouch, this._colorBG);
    },

    onAppear: function() {
        this._swallowTouch.setEnabled(true);
    },

    onDisappear: function() {
        this._swallowTouch.setEnabled(false);
    },

    updateContent: function(id, constructType)
    {

        this._buildingId = id;
        this._constructType = constructType;
        gv.upgradeAble = true;
        this._btnOk.visible = constructType === gv.constructType.upgrade;

        var b = cf.user._buildingList[Math.floor(id/100) - 1][Math.floor(id%100)];
        var level = b._level;

        if (constructType === gv.constructType.upgrade)
            level++;
        if(constructType !== gv.constructType.training) {
            this.updateIcon(b._buildingSTR, level, b._size, b._name, b._is_active, constructType);
            this.updateBar(b._buildingSTR, level, b._size, b._name, b._is_active, constructType);
        } else {
            this.showTraingArmy(b, constructType);
        }
    },

    visibleBar: function(bool1, bool2, bool3)
    {
        this._bar1.visible = bool1;
        this._bar1BG.visible = bool1;
        this._bar1Icon.visible = bool1;
        this._bar1TXT.visible = bool1;

        this._bar2.visible = bool2;
        this._bar2BG.visible = bool2;
        this._bar2Icon.visible = bool2;
        this._bar2TXT.visible = bool2;

        this._bar3.visible = bool3;
        this._bar3BG.visible = bool3;
        this._bar3Icon.visible = bool3;
        this._bar3TXT.visible = bool3;
    },

    replaceIconBar: function(ord, url)
    {
        switch(ord)
        {
            case this._orderBar.bar1:
                this.removeChild(this._bar1Icon);
                this._bar1Icon = cc.Sprite(url);
                this._bar1Icon = cc.Sprite(url);
                this._bar1Icon.attr({
                    anchorX: 1,
                    anchorY: 0.5,
                    x: 0.5 * this._bg.height * this._bgScale / 10,
                    y: 0.5 * this._bg.height * this._bgScale / 2,
                    visible :true,
                });
                this.addChild(this._bar1Icon, 2, this._TAG_BAR1_ICON);
                break;
            case this._orderBar.bar2:
                this.removeChild(this._bar2Icon);
                this._bar2Icon = cc.Sprite(url);
                this._bar2Icon.attr({
                    anchorX: 1,
                    anchorY: 0.5,
                    x: 0.5 * this._bg.height * this._bgScale / 10,
                    y: this._bar1BG.y - this._offSetBar,
                    visible: true,
                });
                this.addChild(this._bar2Icon, 2, this._TAG_BAR2_ICON);
                break;
            case this._orderBar.bar3:
                this.removeChild(this._bar3Icon);
                this._bar3Icon = cc.Sprite(url);
                this._bar3Icon.attr({
                    anchorX: 1,
                    anchorY: 0.5,
                    x: 0.5 * this._bg.height * this._bgScale / 10,
                    y: this._bar1BG.y - this._offSetBar * 2,
                    visible: true,
                });
                this.addChild(this._bar3Icon, 2, this._TAG_BAR3_ICON);
                break;
            default:
                break;
        }
    },

    showTraingArmy: function(building, constructType) {

        if(constructType !== gv.constructType.training) return;

        this.visibleBar(false, false, false);
        this._grass.visible = false;
        this._icon.visible = false;
        this._timeRequireTXT.visible = false;
        if(this.getChildByTag(this._TAG_EFFECT)) this._effect.visible = false;

        this._txtTitle.setString(building._name + " " + (building._id%100 + 1));
        if(this.getChildByTag(this._TAG_CONTENT_REQUIRE)) {
            this.getChildByTag(this._TAG_CONTENT_REQUIRE).visible = false;
        }

        this.showTrainingLayer();
    },

    updateBar: function(str, level, size, name, status, constructType)
    {
        var bar1Length = 1;
        var bar1MaxLength = 1;
        var bar2Length = 1;
        var bar2MaxLength = 1;
        var bar3Length = 1;
        var bar3MaxLength = 1;

        var preText1 = "";
        var preText2 = "";
        var preText3 = "";

        if (!status) level--;

        switch (str) {
            case gv.buildingSTR.townHall:
                this.visibleBar(true, true, true);
                bar1Length = gv.json.townHall[str][level]["hitpoints"];
                bar1MaxLength = gv.json.townHall[str][gv.buildingMaxLevel.townHall]["hitpoints"];
                bar2Length = gv.json.townHall[str][level]["capacityGold"];
                bar2MaxLength = gv.json.townHall[str][gv.buildingMaxLevel.townHall]["capacityGold"];
                bar3Length = gv.json.townHall[str][level]["capacityElixir"];
                bar3MaxLength = gv.json.townHall[str][gv.buildingMaxLevel.townHall]["capacityElixir"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                this.replaceIconBar(this._orderBar.bar2, res.upgradeBuildingGUI.iconCapacityGold);
                this.replaceIconBar(this._orderBar.bar3, res.upgradeBuildingGUI.iconCapacityDarkElixir);
                preText1 = "Máu: ";
                preText2 = "Sức chứa: ";
                preText3 = "Sức chứa: ";
                break;
            case gv.buildingSTR.builderHut:
                this.visibleBar(true, false, false);
                bar1Length = gv.json.builderHut[str][level]["hitpoints"];
                bar1MaxLength = gv.json.builderHut[str][gv.buildingMaxLevel.builderHut]["hitpoints"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                preText1 = "Máu: ";
                break;
            case gv.buildingSTR.armyCamp_1:
                this.visibleBar(true, true, false);
                bar1Length = gv.json.armyCamp[str][level]["hitpoints"];
                bar1MaxLength = gv.json.armyCamp[str][gv.buildingMaxLevel.armyCamp_1]["hitpoints"];
                bar2Length = gv.json.armyCamp[str][level]["capacity"];
                bar2MaxLength = gv.json.armyCamp[str][gv.buildingMaxLevel.armyCamp_1]["capacity"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                this.replaceIconBar(this._orderBar.bar2, res.upgradeBuildingGUI.iconTroopCapacity);
                preText1 = "Máu: ";
                preText2 = "Sức chứa: ";
                break;
            case gv.buildingSTR.barrack_1:
                this.visibleBar(true, false, false);
                bar1Length = gv.json.barrack[str][level]["hitpoints"];
                bar1MaxLength = gv.json.barrack[str][gv.buildingMaxLevel.barrack_1]["hitpoints"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                preText1 = "Máu: ";
                break;
            case gv.buildingSTR.resource_1:
                this.visibleBar(true, true, true);
                bar1Length = gv.json.resource[str][level]["hitpoints"];
                bar1MaxLength = gv.json.resource[str][gv.buildingMaxLevel.resource_1]["hitpoints"];
                bar2Length = gv.json.resource[str][level]["capacity"];
                bar2MaxLength = gv.json.resource[str][gv.buildingMaxLevel.resource_1]["capacity"];
                bar3Length = gv.json.resource[str][level]["productivity"];
                bar3MaxLength = gv.json.resource[str][gv.buildingMaxLevel.resource_1]["productivity"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                this.replaceIconBar(this._orderBar.bar2, res.upgradeBuildingGUI.iconCapacityGold);
                this.replaceIconBar(this._orderBar.bar3, res.upgradeBuildingGUI.iconProductionRateGold);
                preText1 = "Máu: ";
                preText2 = "Sức chứa: ";
                preText3 = "Sản lượng: ";
                break;
            case gv.buildingSTR.resource_2:
                this.visibleBar(true, true, true);
                bar1Length = gv.json.resource[str][level]["hitpoints"];
                bar1MaxLength = gv.json.resource[str][gv.buildingMaxLevel.resource_2]["hitpoints"];
                bar2Length = gv.json.resource[str][level]["capacity"];
                bar2MaxLength = gv.json.resource[str][gv.buildingMaxLevel.resource_2]["capacity"];
                bar3Length = gv.json.resource[str][level]["productivity"];
                bar3MaxLength = gv.json.resource[str][gv.buildingMaxLevel.resource_2]["productivity"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                this.replaceIconBar(this._orderBar.bar2, res.upgradeBuildingGUI.iconCapacityElixir);
                this.replaceIconBar(this._orderBar.bar3, res.upgradeBuildingGUI.iconProductionRateElixir);
                preText1 = "Máu: ";
                preText2 = "Sức chứa: ";
                preText3 = "Sản lượng: ";
                break;
            case gv.buildingSTR.storage_1:
                this.visibleBar(true, true, false);
                bar1Length = gv.json.storage[str][level]["hitpoints"];
                bar1MaxLength = gv.json.storage[str][gv.buildingMaxLevel.storage_1]["hitpoints"];
                bar2Length = gv.json.storage[str][level]["capacity"];
                bar2MaxLength = gv.json.storage[str][gv.buildingMaxLevel.storage_1]["capacity"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                this.replaceIconBar(this._orderBar.bar2, res.upgradeBuildingGUI.iconCapacityGold);
                preText1 = "Máu: ";
                preText2 = "Sức chứa: ";
                break;
            case gv.buildingSTR.storage_2:
                this.visibleBar(true, true, false);
                bar1Length = gv.json.storage[str][level]["hitpoints"];
                bar1MaxLength = gv.json.storage[str][gv.buildingMaxLevel.storage_2]["hitpoints"];
                bar2Length = gv.json.storage[str][level]["capacity"];
                bar2MaxLength = gv.json.storage[str][gv.buildingMaxLevel.storage_2]["capacity"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                this.replaceIconBar(this._orderBar.bar3, res.upgradeBuildingGUI.iconCapacityElixir);
                preText1 = "Máu: ";
                preText2 = "Sức chứa: ";
                break;
            case gv.buildingSTR.defence_1:
                this.visibleBar(true, true, false);
                bar1Length = gv.json.defence[str][level]["hitpoints"];
                bar1MaxLength = gv.json.defence[str][gv.buildingMaxLevel.defence_1]["hitpoints"];
                bar2Length = gv.json.defence[str][level]["damagePerShot"];
                bar2MaxLength = gv.json.defence[str][gv.buildingMaxLevel.storage_2]["damagePerShot"];
                this.replaceIconBar(this._orderBar.bar1, res.upgradeBuildingGUI.hpIcon);
                this.replaceIconBar(this._orderBar.bar2, res.upgradeBuildingGUI.iconDameDef);
                preText1 = "Máu: ";
                preText2 = "Sát thương: ";
                break;
            default:
                break;
        }

        /* Nếu xem info thì bar1MaxLength = Hp */
        if (constructType == gv.constructType.info)
        {
            bar1MaxLength = bar1Length;
            bar2MaxLength = bar2Length;
            bar3MaxLength = bar3Length;
        }

        this._bar1TXT.setString(preText1 + (bar1Length + "/" + bar1MaxLength));
        this._bar1.setTextureRect(cc.rect(0, 0, bar1Length/bar1MaxLength * cf.popUpGUI_Construct.barWidth, cf.popUpGUI_Construct.barHeight));

        this._bar2TXT.setString(preText2 + (bar2Length + "/" + bar2MaxLength));
        this._bar2.setTextureRect(cc.rect(0, 0, bar2Length/bar2MaxLength * cf.popUpGUI_Construct.barWidth, cf.popUpGUI_Construct.barHeight));

        this._bar3TXT.setString(preText3 + (bar3Length + "/" + bar3MaxLength));
        this._bar3.setTextureRect(cc.rect(0, 0, bar3Length/bar3MaxLength * cf.popUpGUI_Construct.barWidth, cf.popUpGUI_Construct.barHeight));

    },

    updateIcon: function(str, level, size, name, status, constructType)
    {
        /* invisible All Bar */
        this.visibleBar(false, false, false);

        if(this.getChildByTag(this._TAG_ICON))
            this.removeChildByTag(this._TAG_ICON);
        if (this.getChildByTag(this._TAG_GRASS))
            this.removeChildByTag(this._TAG_GRASS);
        if (this.getChildByTag(this._TAG_EFFECT))
            this.removeChildByTag(this._TAG_EFFECT);

        if (!status) level--;

        //this._bar1Icon.setSpriteFrame(new cc.SpriteFrame(res.upgradeBuildingGUI.iconGold));

        /* Title Bar */
        this._txtTitle.setString(((this._constructType == gv.constructType.upgrade) ? "Nâng lên " : "") + name + " cấp " + level);

        /* Require*/
        var gold = null;
        var elixir = null;
        var darkElixir = null;
        var coin = null;
        var time = null;

        /* Hp Bar */
        var bar1Length = null;
        var bar1MaxLength = null;
        var bar2Length = null;
        var bar2MaxLength = null;
        var bar3Length = null;
        var bar3MaxLength = null;


        switch(str) {
            case gv.buildingSTR.townHall:
                time = gv.json.townHall[str][level]["buildTime"];
                gold = gv.json.townHall[str][level]["gold"];
                elixir = 0;
                darkElixir = 0;
                coin = 0;
                break;
            case gv.buildingSTR.builderHut:
                time = 0;
                gold = 0;
                elixir = 0;
                darkElixir = 0;
                coin = gv.json.builderHut[str][level]["coin"];
                break;
            case gv.buildingSTR.armyCamp_1:
                time = gv.json.armyCamp[str][level]["buildTime"];
                gold = 0;
                elixir = gv.json.armyCamp[str][level]["elixir"];
                darkElixir = gv.json.armyCamp[str][level]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.barrack_1:
                time = gv.json.barrack[str][level]["buildTime"];
                gold = 0;
                elixir = gv.json.barrack[str][level]["elixir"];
                darkElixir = gv.json.barrack[str][level]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.resource_1:
                time = gv.json.resource[str][level]["buildTime"];
                gold = gv.json.resource[str][level]["gold"];
                elixir = gv.json.resource[str][level]["elixir"];
                darkElixir = gv.json.resource[str][level]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.resource_2:
                time = gv.json.resource[str][level]["buildTime"];
                gold = gv.json.resource[str][level]["gold"];
                elixir = gv.json.resource[str][level]["elixir"];
                darkElixir = gv.json.resource[str][level]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.storage_1:
                time = gv.json.storage[str][level]["buildTime"];
                gold = gv.json.storage[str][level]["gold"];
                elixir = gv.json.storage[str][level]["elixir"];
                darkElixir = gv.json.storage[str][level]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.storage_2:
                time = gv.json.storage[str][level]["buildTime"];
                gold = gv.json.storage[str][level]["gold"];
                elixir = gv.json.storage[str][level]["elixir"];
                darkElixir = gv.json.storage[str][level]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.defence_1:
                time = gv.json.defence[str][level]["buildTime"];
                gold = gv.json.defence[str][level]["gold"];
                elixir = 0;
                darkElixir = gv.json.defence[str][level]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.obstacle:
                time = gv.json.obstacle[str][level]["buildTime"];
                break;
            default:
                break;
        };
        this._cost.gold = gold;
        this._cost.elixir = elixir;
        this._cost.darkElixir = darkElixir;
        this._cost.coin = coin;

        /* Time Require */
        if (this._constructType == gv.constructType.upgrade) {
            this._timeRequireTXT.setString(cf.secondsToLongTime(time));
            this._timeRequireTXT.visible = true;
        }
        else
            this._timeRequireTXT.visible = false;

        /* Resource Require */
        if (this.getChildByTag(this._TAG_CONTENT_REQUIRE))
            this.removeChildByTag(this._TAG_CONTENT_REQUIRE);
        if (this._constructType = gv.constructType.upgrade) {
            var tmp = new PopUpConstruct.getNodeResourceRequire(gold, elixir, darkElixir, coin);
            tmp.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._btnOk.x,
                y: this._btnOk.y
            });
            this.addChild(tmp, 5, this._TAG_CONTENT_REQUIRE);
        }

        /* Center Icon */
        switch(str) {
            case gv.buildingSTR.townHall:
                this._icon = cc.Sprite(res.folder_town_hall + str + "_" + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.builderHut:
                this._icon = cc.Sprite(res.folder_builder_hut + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.armyCamp_1:
                this._icon = cc.Sprite(res.folder_army_camp + str + "_" + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);;
                break;
            case gv.buildingSTR.barrack_1:
                this._icon = cc.Sprite(res.folder_barrack + str + "_" + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.resource_1:
                this._icon = cc.Sprite(res.folder_gold_mine + str + "_" + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.resource_2:
                this._icon = cc.Sprite(res.folder_elixir_collector + str + "_" + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.storage_1:
                this._icon = cc.Sprite(res.folder_gold_storage + str + "_" + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.storage_2:
                this._icon = cc.Sprite(res.folder_elixir_storage + str + "_" + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.defence_1:
                this._icon = cc.Sprite(res.folder_canon + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.obstacle:
                this._icon = cc.Sprite(res.folder_obs + level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            default:
                break;
        }
        this._icon.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 0.75
        });
        this._icon.setPosition(- this._bg.width * this._bgScale / 4, this._bg.height * this._bgScale / 8);
        this.addChild(this._icon, 2, this._TAG_ICON);

        /* Grass */
        this._grass = new grass(size);
        this._grass.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 1.5,
        })
        this._grass.setPosition(- this._bg.width * this._bgScale / 4, this._bg.height * this._bgScale / 8);
        this.addChild(this._grass, 1, this._TAG_GRASS);

        /* Effect */
        //if ((str == gv.buildingSTR.barrack_1 && level <4) || str == gv.buildingSTR.builderHut || str == gv.buildingSTR.storage_1 || str == gv.buildingSTR.storage_2) return;
        var arrNoEffect = [gv.buildingSTR.builderHut, gv.buildingSTR.storage_1, gv.buildingSTR.storage_2, gv.buildingSTR.storage_3, gv.buildingSTR.defence_1];
        if ((str == gv.buildingSTR.barrack_1 && level <4) || arrNoEffect.indexOf(str) >= 0) return;
        if (str != gv.buildingSTR.armyCamp_1 && str != gv.buildingSTR.townHall)
            this._effect = cc.Sprite("res/Art/Effects/" + str + "_" + level + "_effect/00.png");
        if (str == gv.buildingSTR.armyCamp_1)
            this._effect = cc.Sprite("res/Art/Effects/armycam_1/00.png");
        if (str == gv.buildingSTR.townHall)
            this._effect = cc.Sprite("res/Art/Effects/towhall_flame/00.png")
        this._effect.attr({
            anchorX: 0.5,
            anchorY: (str == gv.buildingSTR.armyCamp_1) ? 0 : 0.5,
            scale: (str == gv.buildingSTR.resource_1 || str == gv.buildingSTR.resource_2)? 0.75 : 1,
        });
        this._effect.setPosition(- this._bg.width * this._bgScale / 4, this._bg.height * this._bgScale / 8);
        this.addChild(this._effect, 2, this._TAG_EFFECT);
    }
})

PopUpConstruct.getOrCreate = function()
{
    if (!gv.PopUpConstruct)
    {
        gv.PopUpConstruct = new PopUpConstruct();
    }
    return gv.PopUpConstruct;
}

PopUpConstruct.getNodeResourceRequire = cc.Node.extend({
    txtGold: null,
    txtElixir: null,
    txtDarkElixir: null,
    txtCoin: null,

    iconGold: null,
    iconElixir: null,
    iconDarkElixir: null,
    iconCoin: null,

    ctor: function(gold, elixir, darkElixir, coin)
    {
        var sum = 0;
        sum += (gold != 0) ? 1 : 0;
        sum += (elixir != 0) ? 1 : 0;
        sum += (darkElixir != 0) ? 1 : 0;
        sum += (coin != 0) ? 1 : 0;
        this._super();
        if (gold != 0)
        {
            this.txtGold = cc.LabelBMFont(gold, font.soji20);
            this.txtGold.setColor(cc.color(255, 255, 255, 255));
            this.txtGold.setAnchorPoint(1, 0.5);
            this.txtGold.setPosition(cc.p(0, sum / 2 * this.txtGold.height));
            if (gold >= cf.user._currentCapacityGold)
            {
                this.txtGold.setColor(cc.color(255, 0, 0, 255));
                gv.upgradeAble = false;
            }
            this.addChild(this.txtGold, 0);

            this.iconGold = cc.Sprite(res.upgradeBuildingGUI.iconGold);
            this.iconGold.setAnchorPoint(cc.p(1, 0.5));
            this.iconGold.setPosition(cc.p(40, this.txtGold.y));
            this.addChild(this.iconGold, 0);
        };
        if (elixir != 0)
        {
            this.txtElixir = cc.LabelBMFont(elixir, font.soji20);
            this.txtElixir.setColor(cc.color(255, 255, 255, 255));
            this.txtElixir.setAnchorPoint(1, 0.5);
            this.txtElixir.setPosition(cc.p(0, (sum-1) / 2 * this.txtElixir.height));
            if (elixir >= cf.user._currentCapacityElixir)
            {
                this.txtElixir.setColor(cc.color(255, 0, 0, 255));
                gv.upgradeAble = false;
            }
            this.addChild(this.txtElixir, 0);

            this.iconElixir = cc.Sprite(res.upgradeBuildingGUI.iconElixir);
            this.iconElixir.setAnchorPoint(cc.p(1, 0.5));
            this.iconElixir.setPosition(cc.p(40, this.txtElixir.y));
            this.addChild(this.iconElixir, 0);
        };
        if (darkElixir != 0)
        {
            this.txtDarkElixir = cc.LabelBMFont(darkElixir, font.soji20);
            this.txtDarkElixir.setColor(cc.color(255, 255, 255, 255));
            this.txtDarkElixir.setAnchorPoint(1, 0.5);
            this.txtDarkElixir.setPosition(cc.p(0, -(sum-1) / 2 * this.txtDarkElixir.height));
            if (darkElixir >= cf.user._currentCapacityDarkElixir)
            {
                this.txtDarkElixir.setColor(cc.color(255, 0, 0, 255));
                gv.upgradeAble = false;
            }
            this.addChild(this.txtDarkElixir, 0);

            this.iconDarkElixir = cc.Sprite(res.upgradeBuildingGUI.iconDarkElixir);
            this.iconDarkElixir.setAnchorPoint(cc.p(1, 0.5));
            this.iconDarkElixir.setPosition(cc.p(40, this.txtDarkElixir.y));
            this.addChild(this.iconDarkElixir, 0);
        };
        if (coin != 0)
        {
            this.txtCoin = cc.LabelBMFont(coin, font.soji20);
            this.txtCoin.setColor(cc.color(255, 255, 255, 255));
            this.txtCoin.setAnchorPoint(1, 0.5);
            this.txtCoin.setPosition(cc.p(0, -sum / 2 * this.txtCoin.height));
            if (coin >= cf.user._currentCapacityCoin)
            {
                this.txtCoin.setColor(cc.color(255, 0, 0, 255));
                gv.upgradeAble = false;
            }
            this.addChild(this.txtCoin, 0);

            this.iconCoin = cc.Sprite(res.upgradeBuildingGUI.iconCoin);
            this.iconCoin.setAnchorPoint(cc.p(1, 0.5));
            this.iconCoin.setPosition(cc.p(40, this.txtCoin.y));
            this.addChild(this.iconCoin, 0);
        };

    }
})