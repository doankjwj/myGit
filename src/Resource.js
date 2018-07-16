var mapFolder = "res/Art/Map/";
var buildingsFolder = "res/Art/Buildings/";
var effectsFolder = "res/Art/Effects/";
var fontFolder = "res/Art/Fonts/";
var guiFolder = "res/Art/GUIs/";

var res = {
    tilemap_tmx:    mapFolder + "42x42map.tmx",
    bgTopLeft:      mapFolder + "1_0000_Layer-3.png",
    bgBotLeft:      mapFolder + "1_0001_Layer-1.png",
    bgTopRight:     mapFolder + "1_0002_Layer-4.png",
    bgBotRight:     mapFolder + "1_0003_Layer-2.png",
    builderHut:     buildingsFolder + "builder hut/idle/image0000.png"
};

var font = {

    soji20: fontFolder + "soji_20.fnt"

};

var shopGUI = {
    back:               guiFolder + "shop_gui/back.png",
    catalogyBg:         guiFolder + "shop_gui/catalogy_bg.png",
    close:              guiFolder + "shop_gui/close.png",
    elixir:             guiFolder + "shop_gui/elixir.png",
    g:                  guiFolder + "shop_gui/g.png",
    gold:               guiFolder + "shop_gui/gold.png",
    iconDarkElixirBar:  guiFolder + "shop_gui/icon_dElixir_bar.png",
    iconElixirBar:      guiFolder + "shop_gui/icon_elixir_bar.png",
    iconGBar:           guiFolder + "shop_gui/icon_g_bar.png",
    iconGoldBar:        guiFolder + "shop_gui/icon_gold_bar.png",
    info:               guiFolder + "shop_gui/info.png",
    itemBackground:     guiFolder + "shop_gui/item_background.png",
    resBar:             guiFolder + "shop_gui/res_bar.png",
    resInfo:            guiFolder + "shop_gui/res_info.png",
    slot:               guiFolder + "shop_gui/slot.png",
    slotCatalogy:       guiFolder + "shop_gui/slot_catalogy.png",
    time:               guiFolder + "shop_gui/time.png",
    titleBackground:    guiFolder + "shop_gui/title_background.png",
    typeArmy:           guiFolder + "shop_gui/type_army.png",
    typeBuyRes:         guiFolder + "shop_gui/type_buy_res.png",
    typeDC:             guiFolder + "shop_gui/type_dc.png",
    typeDefense:        guiFolder + "shop_gui/type_defense.png",
    typeRes:            guiFolder + "shop_gui/type_res.png",
    typeShield:         guiFolder + "shop_gui/type_shield.png",
    demo:               guiFolder + "shop_gui/Demo.png"
};
var mainGUI = {
    armyIcon:           guiFolder + "Main_Gui/army_icon.png",
    attack:             guiFolder + "Main_Gui/attack.png",
    bgBar1:             guiFolder + "Main_Gui/bg_bar_1.png",
    bgBar2:             guiFolder + "Main_Gui/bg_bar_2.png",
    bgBar3:             guiFolder + "Main_Gui/bg_bar_3.png",
    bgBar4:             guiFolder + "Main_Gui/bg_bar_4.png",
    bgExp:              guiFolder + "Main_Gui/bg_exp.png",
    bgSlider:           guiFolder + "Main_Gui/bg_slider.png",
    builderIcon:        guiFolder + "Main_Gui/builder_icon.png",
    darkElixirBar:      guiFolder + "Main_Gui/darkElixir_bar.png",
    darkElixirIcon:     guiFolder + "Main_Gui/darkElixir_icon.png",
    elixirBar:          guiFolder + "Main_Gui/elixir_bar.png",
    elixirIcon:         guiFolder + "Main_Gui/elixir_icon.png",
    expBar:             guiFolder + "Main_Gui/exp_bar.png",
    expBgBar:           guiFolder + "Main_Gui/exp_bg_bar.png",
    expIcon:            guiFolder + "Main_Gui/exp_icon.png",
    gBar:               guiFolder + "Main_Gui/g_bar.png",
    gIcon:              guiFolder + "Main_Gui/g_icon.png",
    goldBar:            guiFolder + "Main_Gui/gold_bar.png",
    goldIcon:           guiFolder + "Main_Gui/gold_icon.png",
    home:               guiFolder + "Main_Gui/home.png",
    iconExp:            guiFolder + "Main_Gui/ic_exp.png",
    inventory:          guiFolder + "Main_Gui/kho.png",
    lvlUp:              guiFolder + "Main_Gui/level_up.png",
    loading:            guiFolder + "Main_Gui/loading.png",
    ranking:            guiFolder + "Main_Gui/ranking.png",
    setting:            guiFolder + "Main_Gui/setting.png",
    shield:             guiFolder + "Main_Gui/shield.png",
    shop:               guiFolder + "Main_Gui/shop.png",
    trophy:             guiFolder + "Main_Gui/trophy.png",
    trophyBgBar:        guiFolder + "Main_Gui/trophy_bg_bar.png"
};

var g_preload= [
    res.tilemap_tmx,
    res.bgBotLeft,
    res.bgBotRight,
    res.bgTopLeft,
    res.bgTopRight,
    res.builderHut
];