var MainLayer = cc.Layer.extend({
    _map: null,
    _shop: null,

    _usernameField: null,
    _passwordField: null,

    _resBarGold: null,
    _resBarElixir: null,
    _resBarDarkElixir: null,
    _resBarCoin: null,
    _builderBar: null,

    _guiButtonBuildingInfo: null,
    _guiButtonBuildingUpgrade: null,
    _popUp: null,

    _action1Pull: null,
    _action2Pull: null,
    _action1Push: null,
    _action2Push: null,

    _TAG_BG: 242342,
    _TAG_USERNAME_FIELD: 30000,
    _TAG_PASSWORD_FIELD: 30001,
    _TAG_LOGIN_BUTTON  : 30002,


    ctor:function () {
        this._super();
        this.setTag(1000000);
        this.init();
    },

    init: function() {
         var bg = cc.Sprite("res/Art/BG/Capture.PNG");
         bg.setAnchorPoint(cc.p(0, 0))
         this.addChild(bg, 0, this._TAG_BG);
         //
         // var size = cc.director.getVisibleSize();
         // var yBtn = 2*size.height/3;
         // var btnLogin = gv.commonButton(200, 64, size.width/4, yBtn,"Login");
         // this.addChild(btnLogin, 1, this._TAG_LOGIN);
         // btnLogin.addClickEventListener(this.onSelectLogin.bind(this));
         //
         // var btnOfflineMode = gv.commonButton(200, 64, size.width/4, yBtn/2, "Offline Mode");
         // this.addChild(btnOfflineMode, 1, this._TAG_OFFLINE_MODE);
         // btnOfflineMode.addClickEventListener(this.onSelectOfflineMode.bind(this));

        var size = cc.winSize;

        this._usernameField = new ccui.TextField();
        this._usernameField .setTouchEnabled(true);
        this._usernameField .fontName = "Arial";
        this._usernameField .setPlaceHolder("Username");
        this._usernameField .fontSize = 30;
        this._usernameField .x = size.width/2;
        this._usernameField .y = size.height/2 + this._usernameField .height/2;
        this.addChild(this._usernameField, 1, this._TAG_USERNAME_FIELD);

        this._passwordField = new ccui.TextField();
        this._passwordField.setTouchEnabled(true);
        this._passwordField.fontName = "Arial";
        this._passwordField.setPlaceHolder("Password");
        this._passwordField.fontSize = 30;
        this._passwordField.x = size.width/2;
        this._passwordField.y = this._usernameField.y - this._usernameField.height - 10;
        this._passwordField.setPasswordEnabled(true);
        this.addChild(this._passwordField, 1, this._TAG_PASSWORD_FIELD);

        var login = gv.commonButton(200, 64, size.width/2, this._passwordField.y - this._passwordField.height - 40,"Login");
        login.addClickEventListener(this.onSelectLogin.bind(this));
        this.addChild(login, 1, this._TAG_LOGIN_BUTTON);
        this.loadJson();

    },

    onSelectLogin: function()
    {
        cc.log("=============== " + "Start Connect");
        gv.usernameSendToServer = this._usernameField.string;
        gv.gameClient.connect();
    },

    onSelectOfflineMode: function()
    {
        this.initUser();
        this.initMainGUI();
        this.initMap();
        this.updateGUIandUserInfo();
    },

    onConnectSuccess: function()
    {
        cc.log("=============== " + "Connect Success => Send Handshake");
        this.getChildByTag(this._TAG_USERNAME_FIELD).visible = false;
        this.getChildByTag(this._TAG_PASSWORD_FIELD).visible = false;
        this.getChildByTag(this._TAG_LOGIN_BUTTON).visible = false;
        this.getChildByTag(this._TAG_BG).visible = false;
    },

    onConnectFail: function()
    {
        cc.log("=============== " + "Connect Fail");
    },

    onFinishLogin:function()
    {
        cc.log("=============== " + "Finish Login");
    },

    onReceiveUserInfo: function()
    {
        //this.removeChildByTag(this._TAG_MAP);
        this.initUser();
        this.initMainGUI();
        this.initMap();
        this.initRetainBuilding();
        this.updateGUIandUserInfo();

    },

    initUser: function()
    {
        cf.user = new User();
    },

    initMainGUI: function() {
        this.addShopButton();
        this.addSettingButton();
        this.addInventoryButton();
        this.addBuildingButtons();
        this.addResourceBar();
        this.addUserBar();
        this.addBuilderBar();
        {
            this._popUp = PopUpConstruct.getOrCreate();
            this._popUp.setPosition(cc.p(cc.winSize.width /2, - cc.winSize.height));
            this.addChild(this._popUp, 1, gv.tag.TAG_POPUP);
        }
    },

    initMap: function()
    {
        this._map = new Map();
        this._map.anchorX = 0;
        this._map.anchorY = 0;
        var centering = cc.p(-this._map._width/2 * this._map.scale + cc.winSize.width/2, -this._map._height/2 * this._map.scale + cc.winSize.height/2)
        this._map.setPosition(centering);
        this.addChild(this._map, 0, gv.tag.TAG_MAP);
        this.moveMap();

    },

    initRetainBuilding: function()
    {
        var building = null;
        for (var i = 0; i <= gv.buildingTypeCount; i++)
            for (var j = 0; j < cf.user._buildingListCount[i]; j++)
        {
            building = cf.user._buildingList[i][j];
            if (!building._is_active)
            {
                cc.log(building._name);
                building.updateConstructType();

            }
        };

        if (!building._is_active)
        {
            cc.log(building._name);
            building.updateConstructType();

        }
    },

    updateGUIandUserInfo: function()
    {
        cf.user.updateMaxStorage();
        cf.user.updateBuilder();
    },

    addResourceBar: function() {
        this._resBarGold = new GUI_ResourceBar(1);
        this._resBarGold.attr({
            x: cc.winSize.width - cf.offSetGui,
            y: cc.winSize.height - this._resBarGold.height - cf.offSetGui - 30,
        });
        this.addChild(this._resBarGold, 1, gv.tag.TAG_RESOURCE_BAR_GOLD);

        this._resBarElixir = new GUI_ResourceBar(2);
        this._resBarElixir.attr({
            x: cc.winSize.width - cf.offSetGui,
            y: cc.winSize.height - this._resBarGold.height - cf.offSetGui - 80,
        });
        this.addChild(this._resBarElixir, 1, gv.tag.TAG_RESOURCE_BAR_ELIXIR);

        this._resBarDarkElixir = new GUI_ResourceBar(3);
        this._resBarDarkElixir.attr({
            x: cc.winSize.width - cf.offSetGui,
            y: cc.winSize.height - this._resBarGold.height - cf.offSetGui - 130,
        });
        this.addChild(this._resBarDarkElixir, 1, gv.tag.TAG_RESOURCE_BAR_DARK_ELIXIR);

        this._resBarCoin = new GUI_ResourceBar(4);
        this._resBarCoin.attr({
            x: cc.winSize.width - cf.offSetGui,
            y: cc.winSize.height - this._resBarGold.height - cf.offSetGui - 180,
        });
        this.addChild(this._resBarCoin, 1, gv.tag.TAG_RESOURCE_BAR_COIN);
    },

    addBuilderBar: function()
    {
        this._builderBar = new BuilderBar();
        this._builderBar.attr({
        anchorX: 0.5,
        anchorY: 1,
        x: cc.winSize.width/2,
        y: cc.winSize.height - cf.offSetGui*1.5}
        );

        this.addChild(this._builderBar, 1, gv.tag.TAG_BUILDER_BAR);
    },
    addShopButton: function(){
        var title = cc.LabelBMFont.create('CỬA HÀNG',  font.soji20);
        var shopButton = new ccui.Button();
        shopButton.scale = 1.5;
        shopButton.loadTextures(mainGUI.shop, mainGUI.shop);
        shopButton.attr({
            x: cc.winSize.width - shopButton.width/2*shopButton.scale - 5,
            y: shopButton.height/2*shopButton.scale,
            anchorX: 0.5,
            anchorY: 0.5
        });
        title.scale /= 1.5;
        title.setAnchorPoint(cc.p(0.5, 0.5));
        title.setPosition(cc.p(shopButton.width/2, title.height/2 + 3));
        shopButton.addTouchEventListener(this.openShop, this);
        shopButton.addChild(title);
        this.addChild(shopButton, 1, cf.SHOP_BUTTON_TAG);
    },

    addBuildingButtons: function() {
        var self = this;
        /* Button Info */
        this._guiButtonBuildingInfo = new IconActionBuilding(cf.CODE_BUILDING_INFO);
        this._guiButtonBuildingInfo.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: cc.winSize.width / 2,
            y: -200
        });
        this.addChild(this._guiButtonBuildingInfo, 2);
        this._guiButtonBuildingInfo.addClickEventListener(function()
        {
            self.hideListBotButton();
            if (gv.building_selected == undefined) return;
            if (!self.getChildByTag(gv.tag.TAG_POPUP))
            {
                var popUp = PopUpConstruct.getOrCreate();
                self.addChild(popUp, 1, gv.tag.TAG_POPUP);
            }
            self.getChildByTag(gv.tag.TAG_POPUP).setPosition(cc.winSize.width/2, cc.winSize.height/2);
            self.getChildByTag(gv.tag.TAG_POPUP).visible = true;
            self.getChildByTag(gv.tag.TAG_POPUP).updateContent(gv.building_selected, gv.constructType.info);
            self.getChildByTag(gv.tag.TAG_POPUP).onAppear();
            cc.log(self.getChildByTag(gv.tag.TAG_POPUP)._swallowTouch.isEnabled());
        }. bind(this));

        /* Button Upgrade */
        this._guiButtonBuildingUpgrade = new IconActionBuilding(cf.CODE_BUILDING_UPGRADE);
        this._guiButtonBuildingUpgrade.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: cc.winSize.width / 2,
            y: -200
        });
        this.addChild(this._guiButtonBuildingUpgrade, 2);

        this._guiButtonBuildingUpgrade.addClickEventListener(function()
        {
            self.hideListBotButton();
            if (gv.building_selected == undefined) return;
            var building = cf.user._buildingList[Math.floor(gv.building_selected/100)-1][Math.floor(gv.building_selected % 100)];
            var order = (building._orderInUserBuildingList);
            var orderBuilderHut = (gv.orderInUserBuildingList.builderHut);
            if (order == orderBuilderHut) return;
            if (building._is_active == false) return;
            // if (cf.user._buildingList[Math.floor(gv.building_selected/100)-1][Math.floor(gv.building_selected % 100)]._orderInUserBuildingList = gv.orderInUserBuildingList.builderHut)
            //     return;


            self.getChildByTag(gv.tag.TAG_POPUP).setPosition(cc.winSize.width/2, cc.winSize.height/2);
            self.getChildByTag(gv.tag.TAG_POPUP).visible = true;
            self.getChildByTag(gv.tag.TAG_POPUP).updateContent(gv.building_selected, gv.constructType.upgrade);
            self.getChildByTag(gv.tag.TAG_POPUP).onAppear();
        }.bind(this));
    },

    popUpMessage: function(msg)
    {
        if (gv.building_selected === undefined) {
            return;
        }
        if (!this.getChildByTag(gv.tag.TAG_POPUP_MESSAGE))
        {
            var popUp = PopUPMessage.getOrCreate();
            this.addChild(popUp, 1, gv.tag.TAG_POPUP_MESSAGE);
        }
        this.getChildByTag(gv.tag.TAG_POPUP_MESSAGE).setPosition(cc.winSize.width/2, cc.winSize.height/2);
        cc.log("Pop Up ");
        this.getChildByTag(gv.tag.TAG_POPUP_MESSAGE).visible = true;
        this.getChildByTag(gv.tag.TAG_POPUP_MESSAGE).setMessage(msg);
        this.getChildByTag(gv.tag.TAG_POPUP_MESSAGE).show();
    },

    hideListBotButton: function()
    {
        this._guiButtonBuildingInfo.setPosition(cc.p(cc.winSize.width/2 - this._guiButtonBuildingInfo.width/2 - 2 * cf.offSetGui, -200));
        this._guiButtonBuildingUpgrade.setPosition(cc.p(cc.winSize.width/2 + this._guiButtonBuildingUpgrade.width/2 + 2 * cf.offSetGui, -200));
    },

    showListBotButton: function() {
        var moveToPos1 = cc.MoveTo(0.1, cc.p(cc.winSize.width/2 - this._guiButtonBuildingInfo.width/2 - 2 * cf.offSetGui, this._guiButtonBuildingInfo.height/2*this.scale + cf.offSetGui));
        this._guiButtonBuildingInfo.runAction(moveToPos1);
        var building = cf.user._buildingList[Math.floor(gv.building_selected/100) - 1][gv.building_selected % 100];
        if (building._is_active) {
            var moveToPos2 = cc.MoveTo(0.1, cc.p(cc.winSize.width / 2 + this._guiButtonBuildingUpgrade.width / 2 + 2 * cf.offSetGui, this._guiButtonBuildingUpgrade.height / 2 * this.scale + cf.offSetGui));
            this._guiButtonBuildingUpgrade.runAction(moveToPos2);
        }
    },

    //Exp, Trophy, Username, UserInfo
    addUserBar: function() {
        var userName = cc.LabelBMFont(cf.user._name, font.soji20);
        userName.setAnchorPoint(cc.p(0, 1));
        userName.setPosition(cc.p(cf.offSetGui, cc.winSize.height - cf.offSetGui));
        this.addChild(userName, 1)
    },

    addSettingButton: function() {
        var shopButton = this.getChildByTag(cf.SHOP_BUTTON_TAG);
        var settingButton = new ccui.Button();
        settingButton.scale = 1.5;
        settingButton.loadTextures(mainGUI.setting, mainGUI.setting);
        settingButton.setAnchorPoint(cc.p(0.5, 0.5));
        settingButton.setPosition(cc.p(cc.winSize.width - settingButton.width/2*settingButton.scale - 5 , shopButton.y + shopButton.height/2*shopButton.scale + settingButton.height/2*settingButton.scale));
        this.addChild(settingButton, 1, cf.SETTING_BUTTON_TAG);
        settingButton.addTouchEventListener(this.openSetting, this);
    },

    addInventoryButton: function(){

        var settingButton = this.getChildByTag(cf.SETTING_BUTTON_TAG);
        var inventoryButton = new ccui.Button();
        inventoryButton.scale = 1.5;
        inventoryButton.loadTextures(mainGUI.inventory, mainGUI.inventory);
        inventoryButton.setAnchorPoint(cc.p(0.5, 0.5));
        inventoryButton.setPosition(cc.p(cc.winSize.width - inventoryButton.width/2*inventoryButton.scale - 5 , settingButton.y + settingButton.height/2*settingButton.scale + inventoryButton.height/2*inventoryButton.scale));
        this.addChild(inventoryButton, 1, cf.INVENTORY_BUTTON_TAG);
        inventoryButton.addTouchEventListener(this.openInventory, this);
    },

    repositioning: function(){
        var self = this;
        self._map.x = self._map.x >= 0 ? 0 : self._map.x;
        self._map.y = self._map.y >= 0 ? 0 : self._map.y;

        self._map.x = self._map.x <= cc.winSize.width - self._map._width * self._map.scale ? cc.winSize.width - self._map._width * self._map.scale : self._map.x;
        self._map.y = self._map.y <= cc.winSize.height - self._map._height * self._map.scale + 42 ? cc.winSize.height - self._map._height * self._map.scale + 42 : self._map.y;
    },

    moveMap: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, self._map._width, self._map._height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }

                return false;
            },
            onTouchMoved: function(touch, event) {
                // var self = event.getCurrentTarget()
                cf.isMapMoving = true;
                if (gv.building_selected !== 0)
                    return
                var delta = touch.getDelta();
                var curPos = cc.p(self._map.x, self._map.y);
                curPos = cc.pAdd(curPos, delta);
                self._map.x = curPos.x;
                self._map.y = curPos.y;

                self.repositioning();
                //self._map.x = self._map.x >= 0 ? 0 : self._map.x;
                //self._map.y = self._map.y >= 0 ? 0 : self._map.y;
                //
                //self._map.x = self._map.x <= cc.winSize.width - self._map._width * self._map.scale ? cc.winSize.width - self._map._width * self._map.scale : self._map.x;
                //self._map.y = self._map.y <= cc.winSize.height - self._map._height * self._map.scale + 42 ? cc.winSize.height - self._map._height * self._map.scale + 42 : self._map.y;

                // cc.log(self._map.y);
                // cc.log(self._map.x >= cc.winSize.width - self._map._width);

                // cc.log(self.convertToWorldSpace().x + " " + self.convertToWorldSpace().y);
                //
                // cc.log(self._map.x + " " + self._map.y);

                curPos = null;
            },
            onTouchEnded: function(touch, event) {
                cf.isMapMoving = false;
                return true;
            }
        }, this)
    },

    distance: function(p, q) {
        return Math.sqrt((p.x - q.x)*(p.x - q.x) + (p.y - q.y)*(p.y - q.y));
    },

    zoomMap: function() {
        var self = this;
        var touchLocation_0;
        var touchLocation_1;
        var curMidPoint;
        var newMidPoint;
        var newMapPos;
        if(self === null) return;
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     onTouchBegan: function(touch, event) {
        //         touchLocation = touch.getLocation();
        //         curPosInMap = cc.p(touchLocation.x - self._map.x, touchLocation.y - self._map.y);
        //         newPosInMap = cc.p(curPosInMap.x*scale, curPosInMap.y*scale);
        //         newMapPos = cc.p(touchLocation.x - newPosInMap.x, touchLocation.y - newPosInMap.y);
        //         return true;
        //     },
        //     onTouchMoved: function(touch, event) {
        //     },
        //     onTouchEnded: function(touch, event) {
        //         self._map.setPosition(newMapPos);
        //         self._map.scale *= scale;
        //     }
        // }, this)

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event) {
                return true;
            },
            onTouchesMoved: function(touches, event) {
                if(touches.length < 2) return;
                touchLocation_0 = touches[0].getLocation();
                touchLocation_1 = touches[1].getLocation();
                curMidPoint = cc.p(touchLocation_0.x/2 + touchLocation_1.x/2 - self._map.x, touchLocation_0.y/2 + touchLocation_1.y/2 - self._map.y);
                var dis0 = self.distance(touchLocation_0, touchLocation_1);

                var delta0 = touches[0].getDelta();
                var delta1 = touches[1].getDelta();

                var dis1 = self.distance(cc.pAddIn(touchLocation_0, delta0), cc.pAddIn(touchLocation_1, delta1));

                var scale = dis1/dis0;
                self._map.scale *= scale;
                newMidPoint = cc.p(curMidPoint.x*scale, curMidPoint.y*scale);
                newMapPos = cc.pSubIn(curMidPoint.x, newMidPoint);
                self._map.setPosition(newMapPos);
                self.repositioning();
            },
            onTouchesEnded: function(touches, event) {
            }
        }, this);

    },

    openShop: function(sender, type){
        if(cf.isDeciding) return;
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                var map = this._map;
                if (gv.building_selected !== 0) {
                        var buildingSelected = map.getChildByTag(gv.building_selected);
                        if(buildingSelected !== null) buildingSelected.onEndClick();
                }
                sender.setScale(sender.scale*1.1);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                if(this._shop === null) {
                    this._shop = new Shop();
                    this.addChild(this._shop, 10, cf.SHOP_TAG);
                }
                sender.setScale(sender.scale/1.1);
                this._shop.onAppear();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setScale(sender.scale/1.1);
                break;
        }
    },

    openSetting: function(sender, type){
        if(cf.isDeciding) return;
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                sender.setScale(sender.scale*1.1);
                cc.log("Open setting");
                break;
            case ccui.Widget.TOUCH_MOVED:
                cc.log("moved");
                break;
            case ccui.Widget.TOUCH_ENDED:
                sender.setScale(sender.scale/1.1);
                cc.log("ended");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setScale(sender.scale/1.1);
                cc.log("canceled");
                break;
        }
    },

    openInventory: function(sender, type) {
        if(cf.isDeciding) return;
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                sender.setScale(sender.scale*1.1);
                cc.log("Open inventory");
                break;
            case ccui.Widget.TOUCH_MOVED:
                cc.log("moved");
                break;
            case ccui.Widget.TOUCH_ENDED:
                sender.setScale(sender.scale/1.1);
                cc.log("ended");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.setScale(sender.scale/1.1);
                cc.log("canceled");
                break;
        }
    },

    loadJson:function () {
        cc.loader.loadJson(res.armyCampJson, function(err, data){
            gv.json.armyCamp = data;
        });
        cc.loader.loadJson(res.barrackJson, function(err, data){
            gv.json.barrack = data;
        });
        cc.loader.loadJson(res.builderHutJson, function(err, data){
            gv.json.builderHut = data;
        });
        cc.loader.loadJson(res.initGameJson, function(err, data){
            gv.json.initGame = data;
        });
        cc.loader.loadJson(res.laboratoryJson, function(err, data){
            gv.json.laboratory = data;
        });
        cc.loader.loadJson(res.resourceJson, function(err, data){
            cc.log(data.length);
            gv.json.resource = data;
        });
        cc.loader.loadJson(res.storageJson, function(err, data){
            gv.json.storage = data;
        });
        cc.loader.loadJson(res.townHallJson, function(err, data){
            gv.json.townHall = data;
        });
        cc.loader.loadJson(res.troopJson, function(err, data){
            gv.json.troop = data;
        });
        cc.loader.loadJson(res.troopBaseJson, function(err, data){
            gv.json.troopBase = data;
        });
        cc.loader.loadJson(res.shopItemList, function(error, data){
            gv.json.shopItemList = data;
        });

        cc.loader.loadJson(res.defenceJson, function(err, data) {
           gv.json.defence = data;
        });

        //cc.loader.loadJson("res/ConfigJson/ShopList.json", function(error, data){
        //    cf.ShopItemList = data;
        //});
        cc.loader.loadJson(res.obstacleJson, function(error, data){
            gv.json.obstacle = data;
        });
    }
});

MainLayer.scene = function(){
    var scene = new cc.Scene();
    var layer = new MainLayer();
    scene.addChild(layer);
    return scene;
};

MainLayer.inside = function(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

MainLayer.get_animation = function(str, n)
{
    var arr_effect = [];
    for (var i = 1; i <= n; i++)
    {
        var frame = cc.spriteFrameCache.getSpriteFrame(str + "(" + i + ").png");
        arr_effect.push(frame)
    };
    return cc.Animate(new cc.Animation(arr_effect, cf.time_refresh))
};