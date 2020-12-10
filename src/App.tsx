import React, { useEffect, useState, useMemo, useRef, MutableRefObject} from "react"
import { Scene, LineLayer, CityBuildingLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import styles from "./App.module.less"
import { DrawControl } from '@antv/l7-draw';

const App = () => {
    const mapRef: MutableRefObject<any> = useRef()
    const [mapScene, setMapScene] = useState<any>(null)
    const [driving, setDriving] = useState<any>(null)
    const [map, setMap] = useState<any>(null)
    const [control, setControl] = useState<any>(null)
    const _AMap = (AMap as any)

    useMemo(() => {
        console.log(mapRef.current)
    }, [])

    useEffect(() => {
        console.log(mapRef.current)
    }, [])

    useEffect(() => {
        if (!mapRef.current) return

        const buildingLayer = new _AMap.Buildings({
            zIndex:130,
            merge:false,
            sort:false,
            zooms:[17,20],
            heightFactor: 2//2倍于默认高度，3D下有效
        });
        const options =
            {
                hideWithoutStyle:false,//是否隐藏设定区域外的楼块
                areas:[
                    { //围栏1
                        //visible:false,//是否可见
                        rejectTexture:true,//是否屏蔽自定义地图的纹理
                        color1: 'ffffff00',//楼顶颜色
                        color2: 'ffffcc00',//楼面颜色
                        path: [
                            [116.473606,39.995997],
                            [116.473005,39.995482],
                            [116.472442,39.994971],
                            [116.472267,39.994801],
                            [116.471307,39.995442],
                            [116.471242,39.995446],
                            [116.471163,39.995403],
                            [116.4703,39.994639],
                            [116.469916,39.994315],
                            [116.469194,39.993719],
                            [116.469032,39.993863],
                            [116.468815,39.994108],
                            [116.468625,39.994355],
                            [116.468471,39.99466],
                            [116.468421,39.994811],
                            [116.468366,39.995156],
                            [116.468306,39.996157],
                            [116.468308,39.996557],
                            [116.468483,39.996884],
                            [116.468834,39.997188],
                            [116.469481,39.997764],
                            [116.470511,39.998708],
                            [116.471404,39.999517],
                            [116.471553,39.999568],
                            [116.471713,39.999563],
                            [116.471929,39.999463],
                            [116.473228,39.998584],
                            [116.474008,39.998046],
                            [116.474541,39.997674],
                            [116.474541,39.997576],
                            [116.474604,39.997049],
                            [116.474586,39.996895],
                            [116.474179,39.996516],
                            [116.473585,39.995997],
                            [116.473606,39.995997]
                        ]
                    },
                    { //围栏2
                        color1: 'ff99ff00',
                        color2: 'ff999900',
                        path: [
                            [116.474609,39.993478],
                            [116.474489,39.993495],
                            [116.473693,39.994009],
                            [116.472898,39.994546],
                            [116.472837,39.9946],
                            [116.4728,39.994653],
                            [116.472779,39.994745],
                            [116.47282,39.994815],
                            [116.47491,39.99655],
                            [116.475041,39.996607],
                            [116.47525,39.996643],
                            [116.475715,39.996686],
                            [116.475947,39.996688],
                            [116.476103,39.996658],
                            [116.477228,39.995932],
                            [116.477261,39.995833],
                            [116.477264,39.995729],
                            [116.477205,39.995625],
                            [116.47642,39.994899],
                            [116.474854,39.993558],
                            [116.47469,39.99348],
                            [116.474609,39.993478]
                        ]
                    },
                    { //围栏3
                        color1: 'ff99ff00',
                        color2: 'ff999900',
                        path: [
                            [120.97733, 28.106199],
                            [120.982915, 28.112217],
                            [120.991372, 28.107732],
                            [120.987537, 28.103099],
                            [120.982993, 28.09922]
                        ]
                    }
                ]
            };
        buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle

        const cityLayer = new CityBuildingLayer(
            {
                zIndex: 4
            }
        );

        const map = new _AMap.Map('container', {
            viewMode: '3D',
            resizeEnable: true,
            center: [120.990864,28.040421],//地图中心点
            zoom: 13, //地图显示的缩放级别
            plugins: [],
            layers:[
                new _AMap.TileLayer(),
                buildingLayer,
            ]
        });

        new AMap.Polygon({
            bubble: true,
            fillOpacity:0.2,
            strokeWeight: 2,
            path:  [
                [120.97733, 28.106199],
                [120.982915, 28.112217],
                [120.991372, 28.107732],
                [120.987537, 28.103099],
                [120.982993, 28.09922]
            ],
            map: map
        })

        const scene = new Scene({
            id: 'container',
            map: new GaodeMap({
                mapInstance: map,
            }),
        });

        const control = new DrawControl(scene, {
            position: "topright"
        });
        setControl(control)
        scene.addControl(control);

        const driving = new _AMap.Driving({
            map: map,
            panel: "panel",
            policy: _AMap.DrivingPolicy.REAL_TRAFFIC,
            ferry: 0, // 0 可以使用轮渡 1不可以
            // LEAST_TIME 最快捷模式
            // LEAST_FEE 最经济模式
            // LEAST_DISTANCE 最短距离模式
            // REAL_TRAFFIC 考虑实时路况
        });

        const points = [
            { keyword: '浙江乐清中学',city:'乐清' },
            { keyword: '乐清市政府',city:'乐清' }
        ]

        // 根据起终点经纬度规划驾车导航路线
        // driving.search(
        //     points,
        //     // new _AMap.LngLat(120.990864,28.040421),
        //     // new _AMap.LngLat(121.063878,28.015103),
        //     function(status: any, result: any) {
        //         if (status === 'complete') {
        //             console.log('绘制驾车路线完成')
        //         } else {
        //             console.log('获取驾车数据失败：' + result)
        //         }
        //     })

        scene.on('loaded', async () => {
            // 实例化并添加插件
            // const toolbar = new _AMap.ToolBar();
            const scale = new _AMap.Scale(); // 比例尺
            const overView = new _AMap.OverView(); // 鹰眼

            // _AMap.plugin([
            //     'AMap.ToolBar',
            // ], function(){
            //     // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            //     map.addControl(new _AMap.ToolBar({
            //         // 简易缩放模式，默认为 false
            //         liteStyle: true
            //     }));
            // });


            _AMap.plugin([
                'AMap.ControlBar',
            ], function(){

                // 添加 3D 罗盘控制
                map.addControl(new _AMap.ControlBar({
                    position: {
                        top: "50px",
                        right: "40px"
                    }
                }));
            });

            // (scene.getMapService().map as any).addControl(toolbar);
            (scene.getMapService().map as any).addControl(scale);
            (scene.getMapService().map as any).addControl(overView);

            const data = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [120.993461, 28.104046],
                                    [120.993464, 28.104178],
                                    [120.99323, 28.104003],
                                    [120.993137, 28.104122]
                                ]
                            ]
                        }
                    }
                ]
            }

            const pointLayer = new CityBuildingLayer();
            pointLayer
                .source(data)
                .color('#FFFFFF')
                .size(10)
                .animate({
                    enable: true,
                })
                .style({
                    opacity: 1.0,
                    baseColor: 'rgb(0, 0, 0, 0.2)',
                    windowColor: 'rgb(30,60,89)',
                    brightColor: 'rgb(255,176,38)',
                });
            scene.addLayer(pointLayer);

            const flydata = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [
                                    120.9827220439911,
                                    28.105080126296052
                                ],
                                [
                                    120.9792995452881,
                                    28.102231500802763
                                ]
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [
                                    120.9827220439911,
                                    28.105080126296052
                                ],
                                [
                                    120.98106980323793,
                                    28.10205168469564
                                ]
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [
                                    120.9827220439911,
                                    28.105080126296052
                                ],
                                [
                                    120.98164916038513,
                                    28.10184820821103
                                ]
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [
                                    120.9827220439911,
                                    28.105080126296052
                                ],
                                [120.963586, 28.113794]
                            ]
                        }
                    }
                ]
            }

            const flyLine = new LineLayer()
                .source(flydata, )
                .color('#338feb')
                // .shape('arc3d')
                .shape('arc3d')
                .size(2)
                .active(true)
                .animate({
                    interval: 2,
                    trailLength: 2,
                    duration: 1
                })
                .style({
                    opacity: 1
                });

            scene.addLayer(flyLine);

            const dotData = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                120.97928881645201,
                                28.10223623280151
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                120.98105370998383,
                                28.102065880715063
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                120.98163843154907,
                                28.101838744179084
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                120.98272740840912,
                                28.105084858169157
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "Point",
                            "coordinates": [120.963586, 28.113794]
                        }
                    }
                ]
            }

            const dotPoint = new PointLayer()
                .source(dotData)
                .shape('circle')
                .color('#abc7e9')
                .animate({
                        speed: 0.8
                    }
                )
                .size(30)
                .style({
                    opacity: 1.0
                });
            scene.addLayer(dotPoint);
        });

        scene.on("click", (target) => {
            const { lnglat } = target
            console.log([lnglat.lng, lnglat.lat])
        })
    }, [mapRef])

    const getDrawData = () => {
        const datas = control.getAllData()
        console.log(datas)
    }

    return (
        <div className={styles.mapBox}>
            <div id={"container"} className={styles.container} ref={mapRef}/>
            <div id="panel" className={styles.panel} />
            <button onClick={getDrawData}>获取绘制内容</button>
        </div>
    )
}

export default App

