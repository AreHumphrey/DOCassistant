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


    return (
        <div className="toolbox">
            <div className="patient_info">
                <h1>Пациент</h1>
                <p>ФИО: {patientInfo.fio}</p>
                <p>Дата снимка: {patientInfo.date}</p>
                <p>Дата рождения: {patientInfo.birth}</p>
                <p>Номер медкарты: {patientInfo.medcard_id}</p>
            </div>
            <div className="click_tools">
                <div>
                    <button onClick={() => handleZoom(1.2)}>+</button>Приблизить
                    <button onClick={() => handleZoom(0.8)}>-</button>Отдалить
                </div>
                <div>
                    <button onClick={handleInvert}>Инверсия</button>
                </div>
                <div>
                    <button onClick={() => ToggleTool('Length')}>Отрезок</button>
                </div>
                <div>
                    <button onClick={() => ToggleTool('FreehandRoi')}>Выделение области</button>
                </div>
                <div>
                    <button onClick={() => ToggleTool('Brush')}>Карандаш</button>
                </div>
            </div>
            <div className="scroll_tools">
                <div>
                    Яркость
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={windowCenter}
                        onChange={(e) => handleBrightnessChange(e.target.value)}
                    />
                    <span>{windowCenter}</span>
                </div>
                <div>
                    Контрастность
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={windowWidth}
                        onChange={(e) => handleContrastChange(e.target.value)}
                    />
                    <span>{windowWidth}</span>
                </div>
            </div>
            <button onClick={handleReset}>Сбросить все изменения</button>
        </div>
    )
}

export default ToolBox