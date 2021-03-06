var BuildingNode = cc.Node.extend({
    _id: null,
    _level: null,
    _row: null,
    _col: null,
    _size: null,
    _existed: null,
    _type: null,
    _isActive: true,
    _finishing_time: null,
    _name: null,
    _description: null,
    _constructAble: true,

    _maxLevel: null,

    _jsonConfig: null,

    _center_building: null,
    _effectAnim: null,
    _grass: null,
    _grassShadow: null,
    _arrow: null,
    _green:null,
    _red: null,
    _defence: null,
    _txtName: null,

    /* Button Commit & Cancel Build */
    _gui_commit_build: null,
    _gui_cancel_build: null,

    /* Start Build GUI */
    _info_bar: null,
    _info_bar_bg: null,
    _txt_time_remaining: null,
    _time_remaining: null,
    _time_total: null,
    _BAR_WIDTH: 311,
    _BAR_HEIGHT: 36,
    _effect_level_up: null,

    _buildingSTR: null,

    /* Order In User Building List */
    _orderInUserBuildingList: null,

    _listener: null,
    _listenerMove: null,

    /* Resource Require */
    _cost: {
        gold: null,
        elixir: null,
        darkElixir: null,
        coin: null,
    },

    /* Resource thiếu */
    _require: {
        gold: null,
        elixir: null,
        darkElixir: null,
        coin: null,
    },

    _nextPos: null,

    _builderHutIndex: -1,

    ctor: function(id, level, row, col, existed, isActive) {
        this._super();
        this.scale = cf.SCALE;
        this._existed = existed;
        this._id = id;
        this._row = row;
        this._col = col;
        this._level = level;
        this._isActive = isActive;

        this._nextPos = cc.p(0, 1);

        this._txtName = cc.LabelBMFont(this._name, font.soji20);
        this._txtName.setColor(cc.color(189,183,107, 255));
        this.addChild(this._txtName, 50);
        this._txtName.setAnchorPoint(cc.p(0.5, 0.5));
        this._txtName.setPosition(cc.p(0, this._size * cf.tileSize.height / 2))
        this._txtName.visible = false;

        //Set Id
        var tmp = (this._orderInUserBuildingList + 1).toString();
        if(cf.user._buildingListCount[this._orderInUserBuildingList] >= 10) {
            tmp += cf.user._buildingListCount[this._orderInUserBuildingList].toString();
        } else tmp = tmp + "0" + cf.user._buildingListCount[this._orderInUserBuildingList].toString();
        var tag= parseInt(tmp);
        this.setTag(tag);
        this._id = tag;

        //gv.building_selected = this._id;

        //grass
        this._grass = new grass(this._size, this._orderInUserBuildingList);
        this.addChild(this._grass, 0);

        //building shadow
        this._grassShadow = new GrassShadow(this._size, this._orderInUserBuildingList);
        this.addChild(this._grassShadow, this._grass.getLocalZOrder() + 1);
        this._grassShadow.scale = this._grass.scale;

        //arrow
        this._arrow = cc.Sprite(res.buildingOnMoveGUI(gv.buildOnMoveGUI.arrow, this._size))
        this._arrow.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 0
        });
        this.addChild(this._arrow, this._grassShadow.getLocalZOrder() + 1);


        //green
        this._green = cc.Sprite(res.buildingOnMoveGUI(gv.buildOnMoveGUI.green, this._size));
        this._green.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 2
        })
        this._green.visible = false;
        this.addChild(this._green, this._arrow.getLocalZOrder() + 1);

        //red
        this._red = cc.Sprite(res.buildingOnMoveGUI(gv.buildOnMoveGUI.red, this._size));
        this._red.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 2
        });
        this._red.visible = false;
        this.addChild(this._red, this._green.getLocalZOrder() + 1);

        //defence
        this._defence = cc.Sprite(buildingGUI.defence);
        this._defence.attr({
            anchorX: 0.5,
            anchorY: 0.75,
            scale: this.scale * this._size / 1.5,
            visible: false
        });
        this.addChild(this._defence, 20);

        // Building Status
        if (this._orderInUserBuildingList != gv.orderInUserBuildingList.obstacle)
        {
            this._iconStatus = cc.Sprite(guiFolder + "icons/status_building.png");
            this._iconStatus._str = gv.commonText("..." , 1, 1);
            this._iconStatus._str.setColor(cc.color(0, 0, 0, 255));
            this._iconStatus._str.setPosition(this._iconStatus.width/2, this._iconStatus.height/2);
            this._iconStatus.addChild(this._iconStatus._str);
            this._iconStatus.setVisible(false);
            this._iconStatus.setPosition(0, 70);
            this.addChild(this._iconStatus, this._defence.getLocalZOrder()+1);
        }

        //Button commit build
        this._gui_commit_build = ccui.Button(buildingGUI.buildCommit);
        this._gui_commit_build.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            y: cf.tileSize.height * cf.SCALE * 2,
            x: cf.tileSize.width * cf.SCALE,
            visible: false
        });
        this.addChild(this._gui_commit_build, this._defence.getLocalZOrder() + 1);

        //Button cancel build
        this._gui_cancel_build = ccui.Button(buildingGUI.buildCancel);
        this._gui_cancel_build.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            y: cf.tileSize.height * cf.SCALE * 2,
            x: - cf.tileSize.width * cf.SCALE,
            visible: false
        });
        this.addChild(this._gui_cancel_build, this._defence.getLocalZOrder() + 1);

        // Location
        this.x = cf.tileLocation[row][col].x;
        this.y = cf.tileLocation[row][col].y - (this._size/2) * cf.tileSize.height;


        //Update zOrder
        if(this._existed)
            this.updateZOrder();
        else this.setLocalZOrder(200);

        /* Effect Level Up */
        this.initEffectLevelUp();


        this.schedule(this.onUpdateBuildStatus, 1);

        /* Add event listener */

        this.initListener();

    },
    /* Trả về thứ tự của loại nhà trong danh sách công trình*/
    getBuildingType: function()
    {
        return (Math.floor(this._id/100)) - 1;
    },
    /* Trả về thứ tự của nhà trong số các nhà cùng loại*/
    getBuildingOrder: function()
    {
        return (this._id%100);
    },
    initListener: function()
    {
        /*Listener cho di chuyển công trình*/
        this._listenerMove = this.get_event_listener(this);
        cc.eventManager.addListener(this._listenerMove, this);
        var self = this;

        /*Listener cho chọn công trình*/
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event) {
                //if (cf.isMapMoving) return false;
                cf.mapScalePre = cf.BIG_MAP_SCALE;
                if (gv.building_is_moved != 0) return false;
                if(cf.isDeciding) return false;
                var locationNote = event.getCurrentTarget().convertToNodeSpace(touch.getLocation());
                var w = self._size * cf.tileSize.width / 2 ;
                var h = self._size * cf.tileSize.height / 2 ;
                var x = locationNote.x;
                var y = locationNote.y;
                var polygon = [ [ -w, 0 ], [ 0, h ], [ w, 0 ], [ 0, -h ] ];

                if (fn.pointInsidePolygon([x, y], polygon) && (gv.building_is_moved !== self._id))
                {
                    /* Hiển thị tên công trình*/

                    return true;
                }
                else
                {
                    self.onEndClick();
                    self.hideBuildingButton();

                    for(var i=0; i<cf.selectedWall.length; i++) {
                        cf.selectedWall[i].onRemoveClick();
                    }

                    gv.building_is_moved = 0;
                    cf.selectedWall.length = 0;
                    self._listenerMove.setEnabled(false);
                    //self.updateZOrder();
                    return false;
                }
            },

            onTouchEnded: function(touch, event) {

                if(!cf.isMapMoving && (cf.mapScalePre == cf.BIG_MAP_SCALE)) {
                    if (!(self._buildingSTR == gv.buildingSTR.clanCastle && self._level == 0) && !(self._buildingSTR == gv.buildingSTR.obstacle))
                    {
                        self._listenerMove.setEnabled(true);
                        self._listener.setEnabled(false);
                        self.onClick();
                        self.setLocalZOrder(self.getLocalZOrder() + 200);
                    };

                    var tmpPreLevel = (self._buildingSTR == gv.buildingSTR.obstacle) ? " " : " level ";
                    self._txtName.setString(self._name + tmpPreLevel + self.getTempLevel());
                    self._txtName.visible = true;
                    self.popBuildingScale();

                    self._listener.setEnabled(false);
                    cf.current_r = self._row;
                    cf.current_c = self._col;
                    gv.building_selected = self._id;
                    gv.building_is_moved = self._id;

                    /*Kiểm tra là nhà bang hội level 0 thif pop Up nâng cấp*/
                    if (self._buildingSTR == gv.buildingSTR.clanCastle && self._level == 0 && self._isActive)
                    {
                        var root = fr.getCurrentScreen();
                        root.getChildByTag(gv.tag.TAG_POPUP).updateContent(gv.building_selected, gv.constructType.upgrade);
                        root.getChildByTag(gv.tag.TAG_POPUP).onAppear();
                        self.onRemoveClick();
                        //self._listener.setEnabled(true);
                        //self._listenerMove.setEnabled(false);
                    }
                    self.getParent().getParent().showListBotButton(self._id);
                    fn.playSoundPickUp(self._orderInUserBuildingList);
                    /* Thu hoạch tài nguyên nếu là nhà khai thác đang có nút hiện lên*/
                    if (fn.checkIsResourceAndCollectable(self))
                        self.onHarvest(true);
                }
            }
        });
        if(this._existed) {
            this._listenerMove.setEnabled(false);
            this.locate_map_array(this);
        }
        else {
            this._listenerMove.setEnabled(true);
            this._listener.setEnabled(false);
            cf.current_c = self._col;
            cf.current_r = self._row;
            this.showBuildingButton();
        }
    },

    onRemoveClick: function()
    {
        this.onUnBlur();
        //if (!res.visible)
        {
            this.onEndClick();
            this._listener.setEnabled(true);
            this._listenerMove.setEnabled(false);
            //this.hideBuildingButton();
            gv.building_is_moved = 0;

            this.updateZOrder();
        };

        if (this._red.visible)
        {

            this._row = cf.current_r;
            this._col = cf.current_c;
            this.updateLocaltionByCoor();
            this.updateZOrder();

        };
        this.locate_map_array(this);
        this._red.visible = false;

    },

    get_event_listener: function(b) {
        var self = this;
        var size = b._size;
        var root = fr.getCurrentScreen();
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event)
            {
                var locationNote = event.getCurrentTarget().convertToNodeSpace(touch.getLocation());
                var w = self._size * cf.tileSize.width / 2 ;
                var h = self._size * cf.tileSize.height / 2 ;
                var x = locationNote.x;
                var y = locationNote.y;
                var polygon = [ [ -w, 0 ], [ 0, h ], [ w, 0 ], [ 0, -h ] ];

                if (fn.pointInsidePolygon([ x, y], polygon) )
                {
                    self.onUnBlur();
                    gv.building_selected = self._id;
                    gv.building_is_moved = self._id;
                    var loc = fn.getRowColFromPos(cc.p(touch.getLocation().x - self.getParent().x, touch.getLocation().y - self.getParent().y));
                    gv.buildingMove.currentRow = loc.x;
                    gv.buildingMove.currentCol = loc.y;
                    self._row = loc.x - self._size + 1;
                    self._col = loc.y - self._size +1;
                    if (self._row < 1) self._row = 1;
                    if (self._col < 1) self._col = 1;
                    self.updateLocaltionByCoor(self._size);
                    self.unlocate_map_array(cf.current_r, cf.current_c, size);
                    self.setLocalZOrder(200);

                    if (self._grass.visible)
                        self.onBlur();
                    if (!self.none_space(self._row, self._col, size, self._id))
                    {
                        self._red.visible = true;
                        self._green.visible = false;
                    }
                    else
                    {
                        self._red.visible = false;
                        self._green.visible = true;
                    }
                    return true;
                }
                else
                {
                    for(var i=0; i<cf.selectedWall.length; i++) {
                        cf.selectedWall[i].onRemoveClick();
                    }

                    cf.selectedWall.length = 0;

                    return false;
                }
            },
            onTouchMoved: function(touch, event)
            {
                if (root._listBotButtonIsShown)
                   root.hideListBotButton();
                var moveAble = !(self._buildingSTR == gv.buildingSTR.clanCastle && self._level == 0);
                moveAble = moveAble && !(self._buildingSTR == gv.buildingSTR.obstacle);
                if (!moveAble) return true;
                if (self._id !== gv.building_is_moved) return;

                if(self._buildingSTR === gv.buildingSTR.wall) {
                    self.updateWallIcon(0);
                }

                var location_touch = touch.getLocation();
                var loc = fn.getRowColFromPos(cc.p(location_touch.x - self.getParent().x, location_touch.y - self.getParent().y));
                var r = loc.x;
                var c = loc.y;
                var row = r - size + 1;
                var col = c - size + 1;
                if (row == cf.r_old && col == cf.c_old) return;
                if (!self.check_out_of_map(row, col, size)) return;
                cf.r_old = row;
                cf.c_old = col;
                self._row = row;
                self._col = col;
                self.setLocalZOrder(200);
                self.updateLocaltionByCoor(size);

                if (self._grass.visible)
                    self.onBlur();
                if (!self.none_space(self._row, self._col, size, self._id))
                {
                    self._red.visible = true;
                    self._green.visible = false;
                }
                else
                {
                    self._red.visible = false;
                    self._green.visible = true;
                }

                return true;
            },
            onTouchEnded: function(touch, event)
            {
                self.onUnBlur();
                if (!self._red.visible && self._existed /*&& (self._level>0)*/)
                {
                    self.unlocate_map_array(cf.current_r, cf.current_c, self._size);
                    self.locate_map_array(self);

                    if (cf.current_r != self._row || cf.current_c != self._col)
                        testnetwork.connector.sendMove(self._id, self._row, self._col);
                    //cf.current_r = self._row;
                    //cf.current_c = self._col;
                    self.onEndClick();
                    self._listenerMove.setEnabled(false);
                    self._listener.setEnabled(true);
                    //self.hideBuildingButton();
                    gv.building_is_moved = 0;
                    self._red.visible = false;

                    for(var i=0; i<cf.selectedWall.length; i++) {
                        cf.selectedWall[i].onRemoveClick();
                    }

                    cf.selectedWall.length = 0;

                    self.updateZOrder();

                    fn.playSoundPlace(self._orderInUserBuildingList);
                };
                return true;
            }
        });

        return listener1;
    },

    getTempLevel: function() //Level hiện tại hoặc 1 nếu là đang nâng cấp
    {
        if (this._isActive) return this._level;
        return (this._level == 0) ? 1 : this._level;
    },
    getNextLevel: function() //Level tiếp theo
    {
        return Math.min(this._level + 1, this._maxLevel);
    },
    /* Nâng và hạ công trình khi Click */
    popBuildingScale: function()
    {
        var popIn = cc.ScaleTo(0.1, 1.1);
        var popOut = cc.ScaleTo(0.1, 1);
        this.runAction(cc.Sequence.create(popIn.clone(), popOut.clone()));

        /*Ngoại trừ army Camp*/
        //if (this._effectAnim && this._buildingSTR != gv.buildingSTR.armyCamp_1)
        //    this._effectAnim.runAction(cc.Sequence.create(popIn.clone(), popOut.clone()));

        var tintLight = cc.TintTo(0.5, 255, 255, 255);
        var tintDark = cc.TintTo(0.5, 150, 150, 150);
        this._center_building.runAction(cc.Sequence.create(tintDark, tintLight).repeatForever());
    },
    onBlur: function()
    {
        this._green.setOpacity(150);
        this._red.setOpacity(150);
        this._grass.visible = false;
    },
    onUnBlur: function()
    {
        this._green.setOpacity(255);
        this._red.setOpacity(255);
        this._grass.visible = true;
    },

    updateLocaltionByCoor: function(size)
    {
        size = this._size;
        this.x = cf.tileLocation[this._row][this._col].x;
        this.y = cf.tileLocation[this._row][this._col].y - (size / 2) * cf.tileSize.height;
    },

    initEffectLevelUp: function() {
        this._effect_level_up = cc.Sprite(res.tmp_effect);
        this._effect_level_up.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: 0,
            y: 0,
            scale: cf.SCALE*2,
            visible: false
        });
        this.addChild(this._effect_level_up, this._defence.getLocalZOrder() + 1);
    },

    onStartBuild: function(startConstructType) {
        this.makeBuilderWorking();
        this._existed = true;
        this._isActive = false;
        if (startConstructType == gv.startConstructType.newConstruct) { // click xây mới/ nâng cấp mới

            this._time_remaining = this.getTimeRequire();
            this._time_total = this._time_remaining;
            // Thu hoạch nếu nhà là nhà tài nguyên
            if (this._orderInUserBuildingList >= gv.orderInUserBuildingList.resource_1 && this._orderInUserBuildingList <= gv.orderInUserBuildingList.resource_3 && this._level > 0)
            {
                this.onHarvest(false);
                this._currentCapacity = 0;
            }
            this.onEndClick();
            this.hideBuildingButton();

            audioPlayer.play(res.sound.building_contruct)
        }
        else    // đang nâng cấp dở từ server
        {
            this._time_remaining = Math.floor((this._finishing_time - new Date().getTime()) / 1000);
            this._time_total = this.getTimeRequire();
        };

        /* Time Bar */
        this._info_bar = cc.Sprite(res.upgradeBuildingGUI.infoBar, cc.rect(0,0, this._BAR_WIDTH, this._BAR_HEIGHT));
        this._info_bar.scale = 0.5 * cf.SCALE;
        this._info_bar.attr({
            anchorX: 0,
            anchorY: 1,
            x: - this._BAR_WIDTH / 2 * this._info_bar.scale,
            y: cf.tileSize.height * cf.SCALE * 2
        });
        this.addChild(this._info_bar, this._defence.getLocalZOrder() + 2);
        this._info_bar_bg = cc.Sprite(res.upgradeBuildingGUI.infoBarBG, cc.rect(0,0, this._BAR_WIDTH, this._BAR_HEIGHT));
        this._info_bar_bg.scale = 0.5 * cf.SCALE;
        this._info_bar_bg.attr({
            anchorX: 0,
            anchorY: 1,
            x: - this._BAR_WIDTH / 2 * this._info_bar_bg.scale,
            y: cf.tileSize.height * cf.SCALE * 2
        });
        this.addChild(this._info_bar_bg, this._defence.getLocalZOrder() + 1);

        ///* Time Text */
        var seconds = this._time_total;
        var days = Math.floor(seconds / (3600*24));
        seconds  -= days*3600*24;
        var hrs   = Math.floor(seconds / 3600);
        seconds  -= hrs*3600;
        var mnts = Math.floor(seconds/ 60);
        seconds  -= mnts*60;
        var timeRemaining = (days !== 0 ? (days.toString() + "d") : "" ) + (hrs !== 0 ? (hrs.toString() + "h") : "") + (mnts !== 0 ? (mnts.toString() + "m") : "") + seconds.toString() + "s";

        this._txt_time_remaining = cc.LabelBMFont.create(timeRemaining,  font.soji20);
        this._txt_time_remaining.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: 0,
            y: cf.tileSize.height * cf.SCALE * 2,
        });
        this.addChild(this._txt_time_remaining, this._defence.getLocalZOrder() + 1);

        this._defence.visible = true;

        /* Update Builder */
        if (this._buildingSTR !== gv.buildingSTR.builderHut && this._buildingSTR !== gv.buildingSTR.wall)
        {
            cf.user._builderFree --;
            cf.user.updateSingleBuilder();
        }

        this._txtName.visible = false;

        if (this._time_remaining <= 0)
        {
            this._isActive = true;
            this.onCompleteBuild();
        }
    },
    makeBuilderWorking: function()
    {
        if (this._buildingSTR == gv.buildingSTR.builderHut)
            return;
        for (var i=0; i < cf.user._buildingListCount[gv.orderInUserBuildingList.builderHut]; i++)
        {
            var builderHut = fn.getUserBuilding(gv.orderInUserBuildingList.builderHut, i);
            if (builderHut._free)
            {
                builderHut._free = false;
                builderHut._builder.startWork(this);
                this._builderHutIndex = i;
                return;
            }
        }
    },
    makeBuilderFree: function()
    {
        if (this._buildingSTR == gv.buildingSTR.builderHut)
            return;
        fn.getUserBuilding(gv.orderInUserBuildingList.builderHut, this._builderHutIndex)._builder.finishWork();
        fn.getUserBuilding(gv.orderInUserBuildingList.builderHut, this._builderHutIndex)._free = true;
        this._builderHutIndex = -1;
    },

    onUpdateBuildStatus: function() {
        if (this._isActive)
            return;
        if (!this._existed)
            return ;
        if (this._time_remaining <= 0 && !this._isActive)
        {
            this.onCompleteBuild();
            return;
        }
        this._time_remaining -= 1;

        var seconds = this._time_remaining;

        var days = Math.floor(seconds / (3600*24));
        seconds  -= days*3600*24;
        var hrs   = Math.floor(seconds / 3600);
        seconds  -= hrs*3600;
        var mnts = Math.floor(seconds/ 60);
        seconds  -= mnts*60;
        var timeRemaining = (days !== 0 ? (days.toString() + "d") : "" ) + (hrs !== 0 ? (hrs.toString() + "h") : "") + (mnts !== 0 ? (mnts.toString() + "m") : "") + seconds.toString() + "s";
        this._txt_time_remaining.setString(timeRemaining);
        this._info_bar.setScaleX((this._time_total - this._time_remaining) / this._time_total /2 * cf.SCALE);
    },

    onCancelBuild: function() {
        this._isActive = true;

        this._txt_time_remaining.visible = false;
        this._info_bar.visible = false;
        this._info_bar_bg.visible = false;
        this._defence.visible = false;

        /* Update user infor && GUI */
        cf.user._builderFree++;
        cf.user.updateBuilder();


        if (this._level > 0) {
            this._isActive = true;
        } else
        {
            cf.user._buildingList[this._orderInUserBuildingList].splice(this._id%100, 1);
            cf.user._buildingListCount[this._orderInUserBuildingList] -= 1;
            this.unlocate_map_array(this._row, this._col, this._size);
            this.getParent().removeChild(this);
        }
    },

    onCompleteBuild: function() {
        audioPlayer.play(res.sound.building_finish);
        this.makeBuilderFree();
        this._isActive = true;
        this._level ++;
        if (cf.animationConstructLevelUp == null)
        {
            cc.spriteFrameCache.addSpriteFrames(res.folder_effect + "effect_construct_levelup.plist", res.folder_effect + "effect_construct_levelup.png");
        }
        if(this._txt_time_remaining) {
            this._txt_time_remaining.visible = false;
            this._info_bar.visible = false;
            this._info_bar_bg.visible = false;
            this._defence.visible = false;
        }

        this._effect_level_up.runAction(cc.Sequence.create(cc.CallFunc(function(){this._effect_level_up.visible = true}, this),
            fn.getAnimation("effect_construct_levelup ", 1, 7),
            cc.CallFunc(function(){this._effect_level_up.visible = false}, this)));

        /* Update user infor && GUI */
        cf.user._builderFree ++;
        cf.user.updateBuilder();

        /* Update sprite */
        if (this._level > 1 || this._buildingSTR == gv.buildingSTR.clanCastle)
        {
            this.onUpdateSpriteFrame();
        }
        this.updateLabelName();

        cf.user.updateWallList();
    },

    onUpdateSpriteFrame: function()
    {
        this.updateAnim();
        this.removeChildByTag(gv.tag.TAG_CENTER_BUILDING);
        var str = this._buildingSTR;
        switch(str)
        {
            case gv.buildingSTR.townHall:
                this._center_building = cc.Sprite(res.folder_town_hall + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.builderHut:
                this._center_building = cc.Sprite(res.folder_builder_hut + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.armyCamp_1:
                this._center_building = cc.Sprite(res.folder_army_camp + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);;
                break;
            case gv.buildingSTR.barrack_1:
                this._center_building = cc.Sprite(res.folder_barrack + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.resource_1:
                this._center_building = cc.Sprite(res.folder_gold_mine + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.resource_2:
                this._center_building = cc.Sprite(res.folder_elixir_collector + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.storage_1:
                cc.log("GET It")
                this._center_building = cc.Sprite(res.folder_gold_storage + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                cc.log("FAIL");
                break;
            case gv.buildingSTR.storage_2:
                this._center_building = cc.Sprite(res.folder_elixir_storage + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.storage_3:
                this._center_building = cc.Sprite(res.folder_dark_elixir_storage + str + "_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.obstacle:
                this._center_building = cc.Sprite(res.folder_obs + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.defence_1:
                this._center_building = cc.Sprite(res.folder_defense_base + "DEF_1_" + this._level + "_Shadow.png");
                break;
            case gv.buildingSTR.lab:
                this._center_building = cc.Sprite(res.folder_laboratory + "LAB_1_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.clanCastle:
                this._center_building = cc.Sprite(res.folder_clan_castle + "CLC_1_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.wall:
                this._center_building = cc.Sprite(res.folder_wall + "WAL_1_" + this._level + "/" + "WAL_1_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            default:
                break;
        }
        this._center_building.attr({
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(this._center_building, this._defence.getLocalZOrder() - 1, gv.tag.TAG_CENTER_BUILDING);
    },
    updateLabelName: function()
    {
        this._txtName.setString(this._name + " level " + this.getTempLevel());
    },
    getTimeRequire: function() {


        var json = null;
        switch (this._buildingSTR)
        {
            case gv.buildingSTR.townHall:
                json = gv.json.townHall;
                break;
            case gv.buildingSTR.armyCamp_1:
                json = gv.json.armyCamp;
                break;
            case gv.buildingSTR.barrack_1:
                json = gv.json.barrack;
                break;
            case gv.buildingSTR.resource_1:
                json = gv.json.resource;
                break;
            case gv.buildingSTR.resource_2:
                json = gv.json.resource;
                break;
            case gv.buildingSTR.storage_1:
                json = gv.json.storage;
                break;
            case gv.buildingSTR.storage_2:
                json = gv.json.storage;
                break;
            case gv.buildingSTR.storage_3:
                json = gv.json.storage;
                break;
            case gv.buildingSTR.defence_1:
                json = gv.json.defence;
                break;
            case gv.buildingSTR.builderHut:
                return 0;
            case gv.buildingSTR.lab:
                json = gv.json.laboratory;
                break;
            case gv.buildingSTR.clanCastle:
                json = gv.json.clanCastle;
                break;
            case gv.buildingSTR.wall:
                json = gv.json.wall;
                break;
            default:
                break;
        }
        return (json[this._buildingSTR][this.getNextLevel()]["buildTime"]);
    },

    addCenterBuilding: function() {
        //if (this._buildingSTR !== gv.buildingSTR.obstacle)
        {
            cc.eventManager.addListener(this._listener, this);
        }
        var str = this._buildingSTR;
        switch(str)
        {
            case gv.buildingSTR.townHall:
                this._center_building = cc.Sprite(res.folder_town_hall + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.builderHut:
                this._center_building = cc.Sprite(res.folder_builder_hut + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.armyCamp_1:
                this._center_building = cc.Sprite(res.folder_army_camp + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);;
                break;
            case gv.buildingSTR.barrack_1:
                this._center_building = cc.Sprite(res.folder_barrack + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.resource_1:
                this._center_building = cc.Sprite(res.folder_gold_mine + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.resource_2:
                this._center_building = cc.Sprite(res.folder_elixir_collector + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.storage_1:
                this._center_building = cc.Sprite(res.folder_gold_storage + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.storage_2:
                this._center_building = cc.Sprite(res.folder_elixir_storage + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.storage_3:
                this._center_building = cc.Sprite(res.folder_dark_elixir_storage + str + "_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.obstacle:
                this._center_building = cc.Sprite(res.folder_obs + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.defence_1:
                this._center_building = cc.Sprite(res.folder_defense_base + "DEF_1_" + this.getTempLevel() + "_Shadow.png");
                break;
            case gv.buildingSTR.lab:
                this._center_building = cc.Sprite(res.folder_laboratory + "LAB_1_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.clanCastle:
                this._center_building = cc.Sprite(res.folder_clan_castle + "CLC_1_" + this._level + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            case gv.buildingSTR.wall:
                this._center_building = cc.Sprite(res.folder_wall + "WAL_1_" + this.getTempLevel() + "/" + "WAL_1_" + this.getTempLevel() + "/" + res.image_postfix_1 + "0" + res.image_postfix_2);
                break;
            default:
                break;
        }

        this._center_building.attr({
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(this._center_building, this._defence.getLocalZOrder() - 1, gv.tag.TAG_CENTER_BUILDING);

    },

    onClick: function() {
        this._arrow.visible = true;
        this._green.visible = true;
        var scale_out = cc.scaleTo(0.25, 1.0);
        this._arrow.runAction(scale_out);
        // this._arrow.setGlobalZOrder(50);
    },

    onEndClick: function() {
        this._center_building.stopAllActions();
        this._center_building.runAction(cc.TintTo(0, 255, 255, 255));
        this.getParent().getParent().hideListBotButton();
        var scale_in = cc.scaleTo(0.25, 0);
        this._arrow.runAction(scale_in);
        this._green.visible = false;
        this._arrow.visible = false;
        this._txtName.visible = false;
        this._arrow.setLocalZOrder(this._grassShadow.getLocalZOrder() + 1);
    },

    showBuildingButton: function() {
        var self = this;
        if(!this._existed) {
            this._gui_cancel_build.visible = true;
            this._gui_commit_build.visible = true;
        }
        this._gui_cancel_build.addClickEventListener(function(){
            self.onCancelButton();
        }.bind(this));
        this._gui_commit_build.addClickEventListener(function(){
            self.onCommitButton();
        }.bind(this));
    },
    onCancelButton: function()
    {
        cf.isDeciding = false;
        gv.building_is_moved = 0;
        this.hideBuildingButton();
        this.getParent().removeChild(this);
    },
    onCommitButton: function()
    {
        if (cf.user._builderFree <= 0 && (this._buildingSTR !== gv.buildingSTR.builderHut))
        {
            this.getParent().getParent().popUpMessage("Tất cả thợ đang bận");
            this.hideBuildingButton();
            this.getParent().removeChild(this);
            gv.building_is_moved = 0;
            cf.isDeciding = false;
            return;
        }

        if(!this._red.visible) {
            this.onEndClick();
            this.hideBuildingButton();
            this.checkResource();
            var normalBuild = true;
            gv.buildingNextBuild = this._id;
            if (this._cost.coin > cf.user.getCurrentResource(cf.resType.resource_4))
            {
                fr.getCurrentScreen().popUpMessage("CHƯA ĐỦ TÀI NGUYÊN");
                normalBuild = false;
                this.onCancelButton();
            }
            else
            {
                var constructEnough = (this._require.gold == 0 && this._require.elixir == 0 && this._require.darkElixir == 0);
                if (!constructEnough)
                {
                    var coinRequire = 0;
                    coinRequire += Math.ceil(this._require.gold/1000) + Math.ceil(this._require.elixir/1000) + Math.ceil(this._require.darkElixir/50) + this._require.coin;
                    gv.upgradeAble.etcToCoin = coinRequire;

                    var root = this.getParent().getParent();
                    root.onPopUpToCoin([this._require.gold, this._require.elixir, this._require.darkElixir], cf.constructType.build, this);
                    //normalBuild = false;
                    return;
                }
            }

            if (normalBuild)
                this.onBuild();
            //this._existed = true;
        };

        gv.building_is_moved = 0;
        gv.building_selected = this._id;
    },
    onBuild: function()
    {
        gv.building_selected = this._id;
        this._listener.setEnabled(true);
        this._listenerMove.setEnabled(false);

        this.locate_map_array(this);

        testnetwork.connector.sendBuild(this._id, this._row, this._col);

        this.getParent().addBuildingToUserBuildingList(this);
        this.onStartBuild(gv.startConstructType.newConstruct);

        this.updateZOrder();
        gv.building_is_moved = 0;
        cf.isDeciding = false;
        //this.updateResource();

        cf.user.editCurrentResource(cf.resType.resource_1, -this._cost.gold);
        cf.user.editCurrentResource(cf.resType.resource_2, -this._cost.elixir);
        cf.user.editCurrentResource(cf.resType.resource_3, -this._cost.darkElixir);
        cf.user.editCurrentResource(cf.resType.resource_4, -this._cost.coin);

        fr.getCurrentScreen().getChildByTag(gv.tag.TAG_RESOURCE_BAR_GOLD).updateStatus();
        fr.getCurrentScreen().getChildByTag(gv.tag.TAG_RESOURCE_BAR_ELIXIR).updateStatus();
        fr.getCurrentScreen().getChildByTag(gv.tag.TAG_RESOURCE_BAR_DARK_ELIXIR).updateStatus();
        fr.getCurrentScreen().getChildByTag(gv.tag.TAG_RESOURCE_BAR_COIN).updateStatus();

        /* Hiển thị nút xây nhanh, ..*/
         if (this._time_remaining > 0 && this._buildingSTR != gv.buildingSTR.wall)
             this.getParent().getParent().showListBotButton(this._id);

        if(this._orderInUserBuildingList === gv.orderInUserBuildingList.wall ) {
            var wallCapacity = gv.json.townHall[gv.buildingSTR.townHall][cf.user._buildingList[gv.orderInUserBuildingList.townHall][0]._level]["WAL_1"];
            if(cf.user._buildingListCount[gv.orderInUserBuildingList.wall] >= wallCapacity) return;

            cf.isDeciding = true;
            this.getNextPos();
            var wall = cf.tagToItem(2500, cf.defaultLevel, this._nextPos.x, this._nextPos.y, false);
            this.getParent().addChild(wall);
            cf.building_selected = wall._id;
            wall.onClick();
            wall.showBuildingButton();

        }
    },

    getNextPos: function(){
        if(cf.map_array[this._nextPos.x][this._nextPos.y] === 0) return;

        var pos = cc.p(this._row, this._col);

        var vector = [
            cc.p(0, 1),
            cc.p(1, 0),
            cc.p(0, -1),
            cc.p(-1, 0)
        ];

        for(var i=0; i<4; i++) {

            var posTmp = cc.p(pos.x + vector[i].x, pos.y + vector[i].y);
            if(posTmp.x > 40 || posTmp.y > 40 || posTmp.x < 1 || posTmp.y < 1) continue;

            if(cf.map_array[posTmp.x][posTmp.y] === 0) {
                this._nextPos = posTmp;
                return;
            }
        }
    },

    checkResource: function()
    {
        this._constructAble = true;
        var str = this._buildingSTR;
        var nextLevel = this.getNextLevel();
        var gold = 0;
        var elixir = 0;
        var darkElixir = 0;
        var coin = 0;

        switch(str)
        {
            case gv.buildingSTR.townHall:
                gold = gv.json.townHall[str][nextLevel]["gold"];
                elixir = 0;
                darkElixir = gv.json.townHall[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.builderHut:
                gold = 0;
                elixir = 0;
                darkElixir = 0;
                coin = gv.json.builderHut[str][cf.user._buildingListCount[gv.orderInUserBuildingList.builderHut] + 1]["coin"];
                break;
            case gv.buildingSTR.armyCamp_1:
                gold = 0;
                elixir = gv.json.armyCamp[str][nextLevel]["elixir"];
                darkElixir = gv.json.armyCamp[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.barrack_1:
                gold = 0;
                elixir = gv.json.barrack[str][nextLevel]["elixir"];
                darkElixir = gv.json.barrack[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.resource_1:
                gold = gv.json.resource[str][nextLevel]["gold"];
                elixir = gv.json.resource[str][nextLevel]["elixir"];
                darkElixir = gv.json.resource[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.resource_2:
                gold = gv.json.resource[str][nextLevel]["gold"];
                elixir = gv.json.resource[str][nextLevel]["elixir"];
                darkElixir = gv.json.resource[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.storage_1:
                gold = gv.json.storage[str][nextLevel]["gold"];
                elixir = gv.json.storage[str][nextLevel]["elixir"];
                darkElixir = gv.json.storage[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.storage_2:
                gold = gv.json.storage[str][nextLevel]["gold"];
                elixir = gv.json.storage[str][nextLevel]["elixir"];
                darkElixir = gv.json.storage[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.storage_3:
                gold = gv.json.storage[str][nextLevel]["gold"];
                elixir = gv.json.storage[str][nextLevel]["elixir"];
                darkElixir = gv.json.storage[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.defence_1:
                gold = gv.json.defence[str][nextLevel]["gold"];
                elixir = 0;
                darkElixir = gv.json.defence[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.lab:
                gold = 0;
                elixir = gv.json.laboratory[str][nextLevel]["elixir"];
                darkElixir = gv.json.laboratory[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            case gv.buildingSTR.obstacle:
                break;
            case gv.buildingSTR.wall:
                gold = gv.json.wall[str][nextLevel]["gold"];
                elixir = 0;
                darkElixir = gv.json.wall[str][nextLevel]["darkElixir"];
                coin = 0;
                break;
            default:
                break;
        };
        this._cost.gold = gold;
        this._cost.elixir = elixir;
        this._cost.darkElixir = darkElixir;
        this._cost.coin = coin;

        this._require.gold = Math.max(0, this._cost.gold - cf.user._currentCapacityGold);
        this._require.elixir = Math.max(0, this._cost.elixir - cf.user._currentCapacityElixir);
        this._require.darkElixir = Math.max(0, this._cost.darkElixir - cf.user._currentCapacityDarkElixir);
        this._require.coin = Math.max(0, this._cost.coin - cf.user._currentCapacityCoin);

        if(cf.user._currentCapacityGold < gold) this._constructAble = false;
        if(cf.user._currentCapacityElixir < elixir) this._constructAble = false;
        if(cf.user._currentCapacityDarkElixir < darkElixir) this._constructAble = false;
        if(cf.user._currentCapacityCoin < coin) this._constructAble = false;
    },

    hideBuildingButton: function() {
        this._gui_cancel_build.visible = false;
        this._gui_commit_build.visible = false;
        this._gui_cancel_build.addClickEventListener(function() {});
        this._gui_commit_build.addClickEventListener(function() {});
    },

    none_space: function(row, col, size, id) {
        for (var r = row; r < row + size; r++)
            for (var c = col; c < col + size; c++ )
                if (cf.map_array[r][c] !== 0 && cf.map_array[r][c] !== id)
                {
                    return false;
                }
        return true;
    },

    unlocate_map_array: function(row, col, size) {
        for (var r = row; r < row + size; r ++)
            for (var c = col; c < col + size; c++)
                cf.map_array[r][c] = 0;
    },

    locate_map_array: function(b) {
        var r = b._row;
        var c = b._col;
        var size = b._size;

        for (var i = r; i < r + size; i++)
            for (var j = c; j < c + size; j++)
                cf.map_array[i][j] = b._id;

        if (this._builderHutIndex != -1)
            fn.getUserBuilding(gv.orderInUserBuildingList.builderHut, this._builderHutIndex)._builder.startWork(this);

    },

    check_out_of_map: function(row, col, size) {
        return !(row < 1 || col < 1 || row + size > 41 || col + size > 41);
    },

    updateZOrder: function() {
        this.setLocalZOrder(this._row + this._col + Math.floor(this._size/2));
    }
});
