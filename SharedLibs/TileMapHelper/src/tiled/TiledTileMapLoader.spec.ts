import { EditableTileMap } from "../model/TileMapModel";
import { TiledMap } from "./Tiled";
import { TiledTileMapLoader } from "./TiledTileMapLoader";

describe("TiledTileMapLoader", function () {

  it("can load a tile map without any collision mask", function () {

    // Built from actual json file exported by Tiled.
    const tiledMap : TiledMap = {
    compressionlevel:-1,
    height:2,
    infinite:false,
    layers:[
           {
            data:[1, 0, 2, 0, 0, 1, 0, 2],
            height:2,
            id:1,
            name:"Tile Layer 1",
            opacity:1,
            type:"tilelayer",
            visible:true,
            width:4,
            x:0,
            y:0
           }],
    nextlayerid:2,
    nextobjectid:1,
    orientation:"orthogonal",
    renderorder:"right-down",
    tiledversion:"1.7.2",
    tileheight:8,
    tilesets:[
           {
            firstgid:1,
            columns:2,
            image:"MiniTiledSet.png",
            imageheight:8,
            imagewidth:16,
            margin:0,
            name:"new tileset",
            spacing:0,
            tilecount:2,
            tiledversion:"1.7.2",
            tileheight:8,
            tilewidth:8,
            type:"tileset",
            version:"1.6"
           }],
    tilewidth:8,
    type:"map",
    version:"1.6",
    width:4
   }

    const tileMap: EditableTileMap = TiledTileMapLoader.load(null, tiledMap);
    expect(tileMap.getDimensionX()).to.be(4);
    expect(tileMap.getDimensionY()).to.be(2);
  });
});
