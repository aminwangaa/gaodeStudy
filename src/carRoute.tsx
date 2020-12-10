import React, { useEffect, useState, useMemo, useRef, MutableRefObject} from "react"
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import styles from "./App.module.less"

// scene.on('loaded', () => {
//     // 实例化并添加插件
//     const toolbar = new (window.AMap as any).ToolBar();
//     const scale = new (window.AMap as any).Scale();
//     const driving = new (window.AMap as any).Driving({
//         map: map,
//         panel: "panel",
//         // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
//         policy: (window.AMap as any).DrivingPolicy.LEAST_TIME
//     });
//     const points = [
//         { keyword: '浙江乐清中学',city:'乐清' },
//         { keyword: '乐清市政府',city:'乐清' }
//     ]
//     driving.search(points, function (status: any, result: any) {
//         // 未出错时，result即是对应的路线规划方案
//         console.log(result)
//         if (status === 'complete') {
//             console.log('绘制驾车路线完成')
//         } else {
//             console.log('获取驾车数据失败：' + result)
//         }
//     })
//     setDriving(driving);
//     (scene.getMapService().map as any).addControl(toolbar);
//     (scene.getMapService().map as any).addControl(scale);
//     (scene.getMapService().map as any).addControl(driving);
// });

const App = () => {
    const mapRef: MutableRefObject<any> = useRef()
    const [mapScene, setMapScene] = useState<any>(null)
    const [driving, setDriving] = useState<any>(null)
    const [map, setMap] = useState<any>(null)
    const _AMap = (AMap as any)

    useMemo(() => {
        console.log(mapRef.current)
    }, [])

    useEffect(() => {
        console.log(mapRef.current)
    }, [])

    useEffect(() => {
        if (!mapRef.current) return
        const map = new _AMap.Map('container', {
            viewMode: '3D',
            resizeEnable: true,
            center: [121.062351, 28.164229],//地图中心点
            zoom: 13, //地图显示的缩放级别
        });
        const scene = new Scene({
            id: 'container',
            map: new GaodeMap({
                mapInstance: map,
            }),
        });

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

        // 根据起终点经纬度规划驾车导航路线
        driving.search(
            // points,
            new _AMap.LngLat(120.990864,28.040421),
            new _AMap.LngLat(121.063878,28.015103),
            function(status: any, result: any) {
                if (status === 'complete') {
                    console.log('绘制驾车路线完成')
                } else {
                    console.log('获取驾车数据失败：' + result)
                }
            })

        scene.on('loaded', () => {
            // 实例化并添加插件
            // const toolbar = new _AMap.ToolBar();
            // const scale = new _AMap.Scale();
            //
            // (scene.getMapService().map as any).addControl(toolbar);
            // (scene.getMapService().map as any).addControl(scale);
        });
    }, [mapRef])

    return (
        <div className={styles.mapBox}>
            <div id={"container"} className={styles.container} ref={mapRef}/>
            <div id="panel" className={styles.panel} />
        </div>
    )
}

export default App

