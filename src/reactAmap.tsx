import React, {useEffect, useMemo, useRef, MutableRefObject, useState, useCallback} from "react"
// import { Scene } from '@antv/l7';
// import { GaodeMap } from '@antv/l7-maps';
import styles from "./App.module.less"
import { Map, Marker, Markers, Polygon, Polyline } from 'react-amap';

type Center = {
    longitude: number
    latitude: number
}

type Status = {
    animateEnable: boolean
    doubleClickZoom: boolean
    dragEnable: boolean
    isHotspot: boolean
    jogEnable: boolean
    keyboardEnable: boolean
    resizeEnable: boolean
    rotateEnable: boolean
    scrollWheel: boolean
    touchZoom: boolean
    zoomEnable: boolean
}

type ViewMode = "2D" | "3D" | undefined

type LoadingStyle = {[key: string]: string}

const ReactAmap = () => {
    const mapRef: MutableRefObject<any> = useRef()
    useMemo(() => {
        console.log(mapRef.current)
    }, [])

    useEffect(() => {
        console.log(mapRef.current)
    }, [])

    // useEffect(() => {
    // if (!mapRef.current) return
    // const map = new GaodeMap({
    //     pitch: 35.210526315789465,
    //     center: [121.062351, 28.164229],
    //     zoom: 12,
    //     token: '046155ea2c32ba7358af0a47e0cc7979',
    //     style: "blink",
    //     plugin: ["AMap.ToolBar", "AMap.Scale", "AMap.Driving"],
    // });
    // const scene = new Scene({
    //     id: 'container',
    //     map: map
    // });
    // scene.on("loaded", () => {
    //     const toolbar = new (window.AMap as any).ToolBar();
    //     const scale = new (window.AMap as any).Scale();
    //
    //     (scene.getMapService().map as any).addControl(toolbar);
    //     (scene.getMapService().map as any).addControl(scale);
    //
    //     const driving = new (window.AMap as any).Driving({
    //         map: map,
    //         panel: "panel",
    //         policy: (window.AMap as any).DrivingPolicy.REAL_TRAFFIC,
    //         ferry: 0, // 0 可以使用轮渡 1不可以
    //         // LEAST_TIME 最快捷模式
    //         // LEAST_FEE 最经济模式
    //         // LEAST_DISTANCE 最短距离模式
    //         // REAL_TRAFFIC 考虑实时路况
    //     });
    //
    //     const points = [
    //         { keyword: '浙江乐清中学',city:'乐清' },
    //         { keyword: '乐清市政府',city:'乐清' }
    //     ]
    //
    //     // 根据起终点经纬度规划驾车导航路线
    //     driving.search(
    //         points,
    //         function(status: any, result: any) {
    //             if (status === 'complete') {
    //                 console.log('绘制驾车路线完成')
    //             } else {
    //                 console.log('获取驾车数据失败：' + result)
    //             }
    //         }
    //     )
    // })
    // }, [mapRef])

    const [center, setCenter] = useState<Center>({
        longitude: 120.990864,
        latitude:  28.040421
    })
    const [zoom, setZoom] = useState<number>(14)
    const [ins, setIns] = useState<any>(null)
    const [useAMapUI, setUseAMapUI] = useState<boolean>(true)
    const [useCluster, setUseCluster] = useState<boolean>(true)
    const [viewMode, setViewMode] = useState<ViewMode>("3D")
    const [status, setStatus] = useState<Partial<Status>>({
        animateEnable: true,
        doubleClickZoom: true,
        dragEnable: true,
        isHotspot: false,
        jogEnable: true,
        keyboardEnable: true,
        resizeEnable: true,
        rotateEnable: true,
        scrollWheel: true,
        touchZoom: true,
        zoomEnable: true
    })

    const markerPosition = {
        longitude: 121.003727,
        latitude: 28.098145
    }

    const AMapEvents = {
        created: (mapInstance: any) => {
            console.log('高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
            console.log(mapInstance.getZoom());
        }
    }

    const markerEvents = {
        created: (markerInstance: any) => {
            console.log('高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
            console.log(markerInstance.getPosition());
        },
        click: (markerInstance: any) => {
            console.log(markerInstance)
        }
    }

    const markersEvents = {
        created:(allMarkers: any) => {
            console.log('All Markers Instance Are Below');
            console.log(allMarkers);
        },
        click: (MapsOption: any, marker: any) => {
            console.log(MapsOption, "MapsOptions");
            console.log(marker, "marker");
        },
        mouseover:(e: any, marker: any) => {
            marker.render(renderMouseoverLayout);
        },
        mouseout: (e: any, marker: any) => {
            marker.render(renderMarkerLayout);
        }
    }

    const plugins = [
        'MapType',
        'Scale',
        'OverView',
        'ControlBar', // v1.1.0 新增
        {
            name: 'ToolBar',
            options: {
                visible: true,  // 不设置该属性默认就是 true
                onCreated(ins: any){
                    console.log(ins);
                    setIns(ins)
                },
            },
        },
    ]

    const changeCenter = useCallback(() => {
        setCenter((old) => {
            return {
                longitude: old.longitude + 0.5,
                latitude: old.latitude + 0.5,
            }
        })
        setZoom(11)
    }, [])

    const loadingStyle: LoadingStyle = {
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const Loading = <div style={loadingStyle}>Loading Map...</div>

    const randomPosition = () => ({
        longitude: 100 + Math.random() * 20,
        latitude: 30 + Math.random() * 20
    })

    const randomMarker = (len: number) => (
        Array(len).fill(true).map((e, idx) => ({
            position: randomPosition(),
            draggable: true,
            someProperty: parseInt(String(Math.random() * 100)),
            myLabel: `大仙${idx + 1}`,
            myIndex: idx + 1,
        }))
    );

    const randomAngle = (extData: any, index: number) => {
        if (extData.someProperty % 3 === 0){
            return 45;
        }
        return 0;
    }

    const style = {
        padding: '8px',
        backgroundColor: '#000',
        color: '#fff',
        border: '1px solid #fff',
    };

    const renderMarkerLayout = (extData: any) => {
        // 可以自定义marker样式
        if (extData.myIndex === 3){
            return false;
        }
        return <div style={style}>{extData.myLabel}</div>
    }

    const mouseoverStyle = {
        padding: '8px',
        backgroundColor: '#fff',
        color: '#000',
        border: '1px solid #000',
    }


    const renderMouseoverLayout = (extData: any) => {
        if (extData.myIndex === 3){
            return false;
        }
        return <div style={mouseoverStyle}>{extData.myLabel}</div>
    }

    const initPath = [
        [
            120.96357107162474,
            28.11769455851848
        ],
        [
            120.96136093139647,
            28.115234245598554
        ],
        [
            120.96155405044556,
            28.11269817166292
        ],
        [
            120.9608244895935,
            28.109537458262697
        ],
        [
            120.96224069595337,
            28.107569062734953
        ],
        [
            120.96715450286865,
            28.10696339530573
        ],
        [
            120.9711241722107,
            28.10840184986647
        ],
        [
            120.97174644470215,
            28.111638302100403
        ],
        [
            120.96970796585082,
            28.11432580809748
        ],
        [
            120.97391366958618,
            28.11447721488209
        ],
        [
            120.97477197647093,
            28.11513961705124
        ],
        [
            120.97494363784789,
            28.115858791916505
        ],
        [
            120.97399950027466,
            28.11831909050686
        ],
        [
            120.97153186798096,
            28.119397819009663
        ],
        [
            120.97123146057127,
            28.119473518847965
        ],
        [
            120.9710168838501,
            28.119511368747055
        ],
        [
            120.97063064575194,
            28.119624918364167
        ],
        [
            120.97007274627687,
            28.11968169312764
        ],
        [
            120.96990108489989,
            28.11966276820985
        ],
        [
            120.96964359283447,
            28.11966276820985
        ],
        [
            120.969021320343,
            28.119624918364167
        ],
        [
            120.96809864044191,
            28.11953029369161
        ],
        [
            120.96769094467162,
            28.119473518847965
        ],
        [
            120.96687555313109,
            28.11937889404175
        ],
        [
            120.96593141555786,
            28.11911394414011
        ],
        [
            120.96539497375487,
            28.11937889404175
        ],
        [
            120.96464395523071,
            28.12038191273847
        ],
        [
            120.96404314041138,
            28.12038191273847
        ],
        [
            120.96352815628052,
            28.120230514291187
        ],
        [
            120.96181154251097,
            28.120154814987373
        ],
        [
            120.96110343933105,
            28.119814167458834
        ],
        [
            120.9599232673645,
            28.118602967480868
        ],
        [
            120.95998764038085,
            28.11850834190638
        ],
        [
            120.96048116683959,
            28.118300165348515
        ],
        [
            120.96030950546263,
            28.117845960546656
        ],
        [
            120.95998764038085,
            28.117410679139407
        ],
        [
            120.96000909805298,
            28.117202500450468
        ],
        [
            120.96009492874146,
            28.117126799008812
        ],
        [
            120.96357107162474,
            28.11769455851848
        ]
    ]

    const path = initPath.map(item => {
        return {
            longitude: item[0],
            latitude: item[1]
        }
    })

    const polygon = {
        // strokeColor,
        // strokeOpacity,
        // strokeWeight,
        // fillColor,
        // fillOpacity,
        // strokeStyle,
        // strokeDasharray
    }

    const initLinePath =  [
        [
            120.95704793930052,
            28.11659688742087
        ],
        [
            120.95794916152954,
            28.11050271594658
        ],
        [
            120.96170425415039,
            28.106017033101693
        ],
        [
            120.96681118011476,
            28.10556277627838
        ],
        [
            120.97118854522704,
            28.10775833310529
        ],
        [
            120.97230434417725,
            28.111978975602035
        ],
        [
            120.97490072250365,
            28.113360584820686
        ],
        [
            120.97644567489624,
            28.115177468480205
        ],
        [
            120.97687482833861,
            28.117618857424212
        ],
        [
            120.97350597381592,
            28.12085503150823
        ]
    ]

    const linePath = initLinePath.map(item => {
        return {
            longitude: item[0],
            latitude: item[1]
        }
    })

    useEffect(() => {
        if (!ins) return
        let AMap =  window.AMap;
        new (AMap as any).plugin(['AMap.Driving'], () => {});
        const driving = new (AMap as any).Driving({
            map: ins,
            panel: "panel",
            policy: (AMap as any).DrivingPolicy.REAL_TRAFFIC,
            ferry: 0, // 0 可以使用轮渡 1不可以
            // LEAST_TIME 最快捷模式
            // LEAST_FEE 最经济模式
            // LEAST_DISTANCE 最短距离模式
            // REAL_TRAFFIC 考虑实时路况
        });

        // 根据起终点经纬度规划驾车导航路线
        driving.search(
            // points,
            new (AMap as any).LngLat(120.990864,28.040421),
            new (AMap as any).LngLat(121.063878,28.015103),
            function(status: any, result: any) {
                if (status === 'complete') {
                    console.log('绘制驾车路线完成')
                } else {
                    console.log('获取驾车数据失败：' + result)
                }
            })
    }, [mapRef])



    return (
        <div className={styles.mapBox}>
            <Map
                ref={mapRef}
                amapkey={"046155ea2c32ba7358af0a47e0cc7979"}
                version={"1.4.15"}
                events={AMapEvents}
                plugins={plugins as any}
                zoom={zoom}
                center={center}
                status={status}
                viewMode={viewMode}
                loading={Loading}
                useAMapUI={useAMapUI}
                mapStyle={"fresh"} // normal dark light fresh blue_night
                features={["bg", "point", "road", "building"]} // 地图显示信息
                skyColor={"#A17BBF"}
                buildingAnimation={true}
            >
                {/*<Marker*/}
                {/*    position={markerPosition}*/}
                {/*    events={markerEvents}*/}
                {/*    draggable={true}*/}
                {/*/>*/}
                <Markers
                    angle={(extData: any, index: number) => { return randomAngle(extData, index)}}
                    markers={randomMarker(100)}
                    useCluster={useCluster}
                    events={markersEvents}
                    render={renderMarkerLayout}
                />
                <Polygon
                    path={path}
                    style={{
                        fillColor: "red",
                        strokeColor: "green",
                        fillOpacity: 0.6,
                        strokeOpacity: 0.4
                    }}
                />
                <Polyline
                    path={linePath}
                    style={{
                        strokeColor: "skyblue",
                        strokeOpacity: 0.8
                    }}
                />
            </Map>
            <div id="panel" className={styles.panel} />
            <button onClick={changeCenter}>切换中心点</button>
        </div>
    )
}

export default ReactAmap

