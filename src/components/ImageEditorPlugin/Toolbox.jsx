import React, { useState, useEffect } from "react"
import cornerstone from "cornerstone-core"
import dicomParser from "dicom-parser"
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import cornerstoneTools from "cornerstone-tools"
import Hammer from "hammerjs" // Импортируем Hammer.js
import cornerstoneMath from 'cornerstone-math'

// Устанавливаем внешние зависимости для cornerstone и cornerstoneTools
cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser
cornerstoneTools.external.cornerstone = cornerstone
cornerstoneTools.external.Hammer = Hammer // Добавляем Hammer.js как внешнюю зависимость
cornerstoneTools.external.cornerstoneMath = cornerstoneMath // Добавляем cornerstoneMath как внешнюю зависимость

// Инициализация cornerstone-tools
cornerstoneTools.init()

const ToolBox = ({ patientInfo, divRef, imageIds, currentImageIndex, onReset }) => {
    const [viewport, setViewport] = useState(null)
    const [baseBright, setBaseBright] = useState(0)
    const [baseContrast, setBaseContrast] = useState(0)

    const [zoomLevel, setZoomLevel] = useState(0.2)
    const [windowWidth, setWindowWidth] = useState(50) // Изначальный контраст
    const [windowCenter, setWindowCenter] = useState(50) // Изначальная яркость

    // Храним текущее активное состояние инструментов
    const [activeTool, setActiveTool] = useState(null) // может быть 'Length', 'FreehandRoi' или null

    // Функция для изменения масштаба
    const handleZoom = (factor) => {
        setZoomLevel(prevZoom => {
            const newZoom = prevZoom * factor
            viewport.scale = newZoom
            cornerstone.setViewport(divRef.current, viewport)
            cornerstone.updateImage(divRef.current)
            return newZoom
        })
    }

    // Функция для инверсии изображения
    const handleInvert = () => {
        viewport.invert = !viewport.invert
        cornerstone.setViewport(divRef.current, viewport)
        cornerstone.updateImage(divRef.current)
    }

    // Функция для сброса всех изменений
    const handleReset = () => {
        const element = divRef.current
        cornerstone.reset(element)

        cornerstoneTools.setToolDisabled(activeTool, { mouseButtonMask: 1 })

        // Очистка активного инструмента
        setActiveTool(null)

        setZoomLevel(0.2) // сбросить масштаб
        setWindowWidth(0) // сбросить контраст
        setWindowCenter(50) // сбросить яркость

        // Сброс "Карандаша" (изменение уникальных идентификаторов изображений)
        if (typeof onReset === 'function') {
            onReset()
        }
    }

    // Функция для изменения яркости
    const handleBrightnessChange = (value) => {
        setWindowCenter(value)
        viewport.voi.windowCenter = baseBright * 2.5 - (value * baseBright * 2.5 / 100)
        cornerstone.setViewport(divRef.current, viewport)
        cornerstone.updateImage(divRef.current)
    }

    // Функция для изменения контрастности
    const handleContrastChange = (value) => {
        setWindowWidth(value)
        viewport.voi.windowWidth = baseContrast * 2.5 - (value * baseContrast * 2.5 / 100)
        cornerstone.setViewport(divRef.current, viewport)
        cornerstone.updateImage(divRef.current)
    }

    // Функция для переключения активного инструмента
    const ToggleTool = (toolName) => {
        // Если активен другой инструмент, отключаем его
        if (activeTool) {
            cornerstoneTools.setToolDisabled(activeTool, { mouseButtonMask: 1 })
        }

        // Если тот же инструмент, что и текущий, то выключаем его
        if (activeTool === toolName) {
            setActiveTool(null) // Убираем активный инструмент
            return
        }

        // Активируем новый инструмент
        cornerstoneTools.addTool(cornerstoneTools[`${toolName}Tool`])
        cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 })
        setActiveTool(toolName)
    }

    useEffect(() => {
        if (divRef.current) {
            var stack = { currentImageIdIndex: currentImageIndex, imageIds: imageIds }
            const element = divRef.current
            cornerstone.enable(element)

            cornerstoneTools.addStackStateManager(element, ["stack"])
            cornerstoneTools.addToolState(element, "stack", stack)

            const intervalId = setInterval(() => {
                const viewport = cornerstone.getViewport(element)
                if (viewport) {
                    setViewport(viewport)
                    setBaseBright(viewport.voi.windowCenter)
                    setBaseContrast(viewport.voi.windowWidth)
                    setZoomLevel(viewport.scale)
                    clearInterval(intervalId)
                }
            }, 100) // Проверка каждую сотую секунды, пока viewport не станет доступным
        }
    }, [divRef])

    const [showZoomButtons, setShowZoomButtons] = useState(false);
    const [showBrigthnessButtons, setShowBrigthnessButtons] = useState(false);
    const [showContrastButtons, setShowContrastButtons] = useState(false);
    return (
        <div className="h-full text-white flex items-center ml-8">
            <div className="bg-gray-my-1 h-5/6 flex flex-col gap-4 rounded-5xl">
                <div className="flex flex-row justify-center mt-4"
                ><svg fill="white" className="w-9" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M128 209c-44.735 0-81-36.265-81-81s36.265-81 81-81 81 36.265 81 81-36.265 81-81 81zm22.53-141.14A64.379 64.379 0 0 0 128.5 64a64.352 64.352 0 0 0-22.917 4.19 1317.969 1317.969 0 0 0 21.079 22.104c.77.79 2.042.806 2.831.038 0 0 12.798-12.235 21.038-22.472zm0 121.635c-8.239-10.237-21.05-22.665-21.05-22.665a1.975 1.975 0 0 0-2.806.041s-10.22 10.605-21.09 22.294a64.352 64.352 0 0 0 22.916 4.19 64.379 64.379 0 0 0 22.03-3.86zM89.908 76.531s-26.02 17.694-26.02 51.538c0 33.845 26.02 53.465 26.02 53.465l38.09-39.787 38.376 38.29s27.389-21.385 27.389-52.066c0-30.682-27.739-51.678-27.739-51.678l-25.672 26.32 13.39 13.837 13.112-11.68s6.936 10.757 7.035 23.153c.098 12.396-6.653 24.904-6.653 24.904l-39.191-38.937-37.495 38.69s-7.684-11.61-7.65-25.002c.035-13.393 7.008-24.966 7.008-24.966l12.75 12.488 14.996-12.609-27.746-25.96z" fill-rule="evenodd"></path> </g></svg></div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row">
                        {/* Кнопка с лупой */}
                        <button
                            className="bg-transparent flex justify-center relative"
                            onClick={() => setShowZoomButtons(!showZoomButtons)}
                        >
                            <svg version="1.1" id="Layer_1" fill="white" className="w-7" xmlns="http://www.w3.org/2000/svg" 
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.879 119.799" 
                                enable-background="new 0 0 122.879 119.799" xml:space="preserve">
                            <g>
                                <path d="M49.988,0h0.016v0.007C63.803,0.011,76.298,5.608,85.34,14.652c9.027,9.031,14.619,21.515,14.628,35.303h0.007v0.033v0.04 h-0.007c-0.005,5.557-0.917,10.905-2.594,15.892c-0.281,0.837-0.575,1.641-0.877,2.409v0.007c-1.446,3.66-3.315,7.12-5.547,10.307 l29.082,26.139l0.018,0.016l0.157,0.146l0.011,0.011c1.642,1.563,2.536,3.656,2.649,5.78c0.11,2.1-0.543,4.248-1.979,5.971 l-0.011,0.016l-0.175,0.203l-0.035,0.035l-0.146,0.16l-0.016,0.021c-1.565,1.642-3.654,2.534-5.78,2.646 c-2.097,0.111-4.247-0.54-5.971-1.978l-0.015-0.011l-0.204-0.175l-0.029-0.024L78.761,90.865c-0.88,0.62-1.778,1.209-2.687,1.765 c-1.233,0.755-2.51,1.466-3.813,2.115c-6.699,3.342-14.269,5.222-22.272,5.222v0.007h-0.016v-0.007 c-13.799-0.004-26.296-5.601-35.338-14.645C5.605,76.291,0.016,63.805,0.007,50.021H0v-0.033v-0.016h0.007 c0.004-13.799,5.601-26.296,14.645-35.338C23.683,5.608,36.167,0.016,49.955,0.007V0H49.988L49.988,0z M50.004,11.21v0.007h-0.016 h-0.033V11.21c-10.686,0.007-20.372,4.35-27.384,11.359C15.56,29.578,11.213,39.274,11.21,49.973h0.007v0.016v0.033H11.21 c0.007,10.686,4.347,20.367,11.359,27.381c7.009,7.012,16.705,11.359,27.403,11.361v-0.007h0.016h0.033v0.007 c10.686-0.007,20.368-4.348,27.382-11.359c7.011-7.009,11.358-16.702,11.36-27.4h-0.006v-0.016v-0.033h0.006 c-0.006-10.686-4.35-20.372-11.358-27.384C70.396,15.56,60.703,11.213,50.004,11.21L50.004,11.21z"/>
                            </g>
                            </svg>
                        </button>

                        {showZoomButtons && (
                            <div className="absolute flex flex-row gap-3 left-32 bg-gray-my-3 rounded-5xl">
                                <button 
                                    onClick={(e) => {
                                    e.stopPropagation(); // Останавливаем всплытие, чтобы не переключало showZoomButtons
                                    handleZoom(1.2)
                                    }} 
                                    className="bg-transparent w-full mt-1 text-white rounded-5xl"
                                >
                                    +
                                </button>
                                <button 
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    handleZoom(0.8)
                                    }} 
                                    className="bg-transparent w-full mt-1 text-white rounded-5xl"
                                >
                                    -
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <button onClick={handleInvert} className="bg-transparent"><svg fill="white" className="w-7" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M508.979,147.084L398.046,53.217c-2.534-2.142-6.084-2.628-9.105-1.229c-3.012,1.408-4.941,4.42-4.941,7.748v68.267H25.6 c-14.114,0-25.6,11.486-25.6,25.6s11.486,25.6,25.6,25.6H384v68.267c0,3.328,1.929,6.34,4.941,7.74 c1.152,0.538,2.372,0.794,3.593,0.794c1.98,0,3.942-0.691,5.513-2.014l110.933-93.867c1.92-1.63,3.021-4.011,3.021-6.519 S510.899,148.713,508.979,147.084z M384,162.136H25.6c-4.702,0-8.533-3.823-8.533-8.533s3.831-8.533,8.533-8.533H384V162.136z M401.067,229.072V78.134l89.19,75.469L401.067,229.072z"></path> </g> </g> <g> <g> <path d="M486.4,332.803H128v-68.267c0-3.328-1.929-6.34-4.941-7.74c-3.021-1.399-6.571-0.913-9.105,1.229L3.021,351.892 C1.101,353.513,0,355.894,0,358.403s1.101,4.89,3.021,6.519l110.933,93.867c1.57,1.323,3.533,2.014,5.513,2.014 c1.22,0,2.441-0.256,3.593-0.794c3.012-1.399,4.941-4.412,4.941-7.74v-68.267h358.4c14.114,0,25.6-11.486,25.6-25.6 C512,344.289,500.514,332.803,486.4,332.803z M110.933,433.872l-89.19-75.469l89.19-75.469V433.872z M486.4,366.936H128V349.87 h358.4c4.702,0,8.533,3.823,8.533,8.533C494.933,363.113,491.102,366.936,486.4,366.936z"></path> </g> </g> </g></svg></button>
                    </div>
                    <div>
                        <button onClick={() => ToggleTool('Length')} className="bg-transparent"><svg fill="white" className="w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.63604 14.1238L7.05026 15.538M8.46447 11.2953L9.87868 12.7096M11.2929 8.46691L12.7071 9.88113M14.1213 5.63849L15.5355 7.0527M2.80762 16.9522L7.05026 21.1948L21.1924 7.0527L16.9498 2.81006L2.80762 16.9522Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                    </div>
                    <div>
                        <button onClick={() => ToggleTool('FreehandRoi')} className="bg-transparent"><svg fill="white" className="w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.1668 11.1733C17.1668 12.5307 17.1668 9.81592 17.1668 11.1733ZM17.1668 11.1733C17.1668 12.5307 17.1668 13.8881 17.1668 13.8881M17.1668 11.1733C17.1668 9.81592 20.0001 9.81592 20.0001 11.1733C20.0001 12.5307 20.0001 12.8701 20.0001 18.2997C20.0001 23.7294 7.85591 23.7756 5.68023 18.2997C4.87315 16.2684 5.01308 16.7027 4.2713 14.941C3.52953 13.1794 5.97114 12.1286 6.9472 13.8881C7.92326 15.6477 8.66677 18.4383 8.66677 17.2817C8.66677 16.125 8.66677 12.5307 8.66677 11.1733C8.66677 9.81592 8.66677 5.37546 8.66677 4.01805C8.66677 2.66065 11.5001 2.66065 11.5001 4.01805M17.1668 11.1733C17.1668 9.81592 14.3239 9.81592 14.3334 11.1733M14.3334 11.1733C14.3334 9.81592 11.5001 9.81592 11.5001 11.1733C11.5001 11.4976 11.5001 3.66565 11.5001 4.01805M14.3334 11.1733C14.3334 11.4976 14.3334 10.8209 14.3334 11.1733ZM14.3334 11.1733C14.3477 13.2094 14.3334 13.8881 14.3334 13.8881M11.5001 13.8881C11.5001 13.8881 11.5001 7.41019 11.5001 4.01805" stroke="#000000" stroke-width="1.75" stroke-linecap="round"></path> </g></svg></button>
                    </div>
                    <div>
                        <button onClick={() => ToggleTool('Brush')} className="bg-transparent"><svg fill="white" className="w-7" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 306.637 306.637" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896 l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z"></path> <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095 L265.13,75.602L231.035,41.507z"></path> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg></button>
                    </div>
                    <div className="relative flex flex-row">
                        <button className="bg-transparent"
                        onClick={() => setShowBrigthnessButtons(!showBrigthnessButtons)}><svg fill="white" className="w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                        {showBrigthnessButtons && 
                            <div className="absolute left-24 w-64 h-full flex align-middle justify-center gap-7 bg-gray-my-3 rounded-5xl">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={windowCenter}
                                    onChange={(e) => handleBrightnessChange(e.target.value)}
                                    className="w-11/12 editor-range"
                                />
                            </div>
                        }
                    </div>
                    <div className="relative flex flex-row">
                        <button className="bg-transparent"
                        onClick={() => setShowContrastButtons(!showContrastButtons)}><svg fill="white" className="w-7" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M414.39,97.61A224,224,0,1,0,97.61,414.39,224,224,0,1,0,414.39,97.61ZM256,432V336a80,80,0,0,1,0-160V80C353.05,80,432,159,432,256S353.05,432,256,432Z"></path><path d="M336,256a80,80,0,0,0-80-80V336A80,80,0,0,0,336,256Z"></path></g></svg></button>
                        {showContrastButtons &&
                        <div className="absolute left-24 w-64 h-full flex flex-wrap align-middle justify-center 
                        gap-7 bg-gray-my-3 rounded-5xl">
                            <input
                            type="range"
                            min="0"
                            max="100"
                            value={windowWidth}
                            onChange={(e) => handleContrastChange(e.target.value)}
                            className="w-11/12 editor-range"
                            />
                        </div>
                        }
                    </div>
                    <button onClick={handleReset} className="bg-transparent"><svg fill="white" className="w-7 h-7" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 869.959 869.958" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M146.838,484.584c10.271,10.395,23.804,15.6,37.347,15.6c13.329,0,26.667-5.046,36.897-15.155 c20.625-20.379,20.825-53.62,0.445-74.245l-41.688-42.191h423.78c88.963,0,161.34,72.376,161.34,161.339v4.32 c0,43.096-16.782,83.61-47.255,114.084c-20.503,20.502-20.503,53.744,0,74.246c10.251,10.251,23.688,15.377,37.123,15.377 c13.435,0,26.872-5.125,37.123-15.377c50.305-50.306,78.009-117.188,78.009-188.331v-4.32c0-71.142-27.704-138.026-78.009-188.331 c-50.306-50.305-117.189-78.009-188.331-78.009h-424.99l42.25-41.747c20.625-20.379,20.825-53.62,0.445-74.245 c-20.376-20.624-53.618-20.825-74.244-0.445L15.601,277.068c-9.905,9.787-15.517,23.107-15.6,37.03 c-0.084,13.924,5.367,27.31,15.154,37.215L146.838,484.584z"></path> </g> </g></svg></button>
                </div>
            </div>
        </div>
    )
}

export default ToolBox