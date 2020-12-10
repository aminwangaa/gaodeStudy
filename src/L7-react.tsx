import React, {useCallback, useEffect, useState} from "react"
import { LineLayer, AMapScene, Popup, LayerEvent, Marker, Control } from '@antv/l7-react';
import styles from "./App.module.less"
import { anchorType } from '@antv/l7-utils';
import { WorldLayer, CountryLayer } from '@antv/l7-district';
import { DrawControl } from '@antv/l7-draw';

const App = () => {
    const [data, setData] = useState();
    const [drawControl, setDrawControl] = useState<object | null>(null);
    const [popupInfo, setPopupInfo] = useState<number[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'https://gw.alipayobjects.com/os/basement_prod/32e1f3ab-8588-46cb-8a47-75afb692117d.json',
            );
            const raw = await response.json();
            setData(raw);
        };
        fetchData();
    }, []);

    const onSceneLoaded = useCallback((AMap) => {
        const options = {
            style: {},
            controls: {
                point: true,
                line: true,
                polygon: true,
                rect: true,
                circle: true,
                delete: true
            },
            pickBuffer: 1
        }
        const control = new DrawControl(AMap, options);
        AMap.addControl(control);
        AMap.render()
    }, [])

    const setPopInfo = useCallback((event) => {
        setPopupInfo([120.9902,28.115727])
    }, [])

    return (
        <div className={styles.appContainer}>
            <AMapScene
                map={{
                    token: 'a3f86ad964099eac439e2fd502ea6de3',
                    center: [ 120.9902, 28.115727 ], // 地图初始中心经纬度
                    zoom: 13, // 级别 级别越高显示范围越小 精度越高 地图初始显示级别 {number}  （0-22）
                    pitch: 0, // 地图初始俯仰角度 {number}  default 0
                    mapStyle: "blink", // 内置三种种默认地图样式 dark | light | blink 空地图
                    minZoom: 0, // 地图最小缩放等级 {number}  default 0  (0-22)
                    maxZoom: 22, // 地图最小缩放等级 {number}  default 22  (0-22)
                    rotateEnable: true, // 地图是否可旋转 {Boolean} default true
                    plugin: ['AMap.ToolBar','AMap.Driving']
                }}
                option={{
                    logoVisible: false,
                    logoPosition: "topright", // logo 位置 bottomright|topright|bottomleft|topleft
                    antialias: true,
                    preserveDrawingBuffer: true,
                }}
                className={styles.mapContainer}
                onSceneLoaded={onSceneLoaded}
            >
                <Control type="scale" position="bottomright" />
                <Control type="zoom" position="bottomright" />
                {data && (
                    <LineLayer
                        key={'2'}
                        source={{
                            data,
                        }}
                        size={{
                            values: 1,
                        }}
                        color={{
                            values: '#fff',
                        }}
                        shape={{
                            values: 'line',
                        }}
                        style={{
                            opacity: 1,
                        }}
                        active={{
                            option: {
                                color: 'red',
                            },
                        }}
                    >
                        <LayerEvent
                            type="click"
                            handler={() => {
                                console.log(222)
                            }}
                        />
                        <LayerEvent
                            type="mousemove"
                            handler={() => {
                                console.log(333)
                            }}
                        />
                    </LineLayer>
                )}
                <LineLayer
                    key={'3'}
                    color={{
                        values: '#000',
                    }}
                    shape={{
                        values: 'line',
                    }}
                    animate={{
                        enable: true,
                        interval: 500,
                        speed: 1,
                        duration: 2000,
                        trailLength: 500,
                        repeat: 300,
                        rings: 50
                    }}
                    source={{
                        data: {
                            type: "FeatureCollection",
                            features: [
                                {
                                    type: "Feature",
                                    properties: {},
                                    geometry: {
                                        type: "LineString",
                                        coordinates: [
                                            [
                                                120.9611463546753,
                                                28.11317132433597
                                            ],
                                            [
                                                120.96427917480469,
                                                28.115177468480205
                                            ],
                                            [
                                                120.96636056900023,
                                                28.11124084831421
                                            ],
                                            [
                                                120.97007274627687,
                                                28.113190250399473
                                            ],
                                            [
                                                120.97320556640624,
                                                28.109461751410308
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    }}
                >

                </LineLayer>
                {/*<Marker lnglat ={[120.9902,28.115727]}>*/}
                {/*    <div*/}
                {/*        onClick={() => setPopInfo([120.9902,28.115727])}*/}
                {/*    >*/}
                {/*        檃2*/}
                {/*    </div>*/}
                {/*</Marker>*/}
                {/*{popupInfo && popupInfo.length > 0 && (*/}
                {/*    <Popup*/}
                {/*        option={{*/}
                {/*            closeButton: false*/}
                {/*            // 如果Popup内需要响应Dom事件需设置成false,否则事件不生效*/}
                {/*        }}*/}
                {/*        lnglat ={popupInfo}*/}
                {/*    >*/}
                {/*        <button>檃</button>*/}
                {/*    </Popup>*/}
                {/*)}*/}
            </AMapScene>
        </div>
    );
}

export default App

