import React, { useEffect, useState, useRef } from "react"
import cornerstone from "cornerstone-core"
import dicomParser from "dicom-parser"
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import ImageViewer from "./ImageView"
import ToolBox from "./Toolbox"
import Saver from "./Saver"
import { formatDate } from "./utils"

cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

const EditorWindow = ({ imagePath, needsave }) => {
    const [patientInfo, setPatientInfo] = useState({
        fio: "",
        date: "",
        birth: "",
        medcard_id: ""
    })

    const [currentImageIndex, setCurrentImageIndex] = useState(0)  // Храним индекс текущего изображения
    const [imagesIds, setimagesIds] = useState([]) // Изменяем на пустой массив для хранения первоначальных ids
    const divRef = useRef(null)
    const cvsRef = useRef(null)
    const wheelTimeoutRef = useRef(null) // для хранения ссылки на таймер

    const processDICOM = async (dicomImage) => {
        try {
            const image = await cornerstone.loadImage("wadouri:" + dicomImage)

            setPatientInfo({
                fio: image.data.string('x00100010'),
                date: formatDate(image.data.string('x00080020')),
                birth: formatDate(image.data.string('x00100030')),
                medcard_id: image.data.string('x00100020')
            })

            cornerstone.displayImage(divRef.current, image)
            cornerstone.updateImage(divRef.current)

            const cvs = cvsRef.current
            cvs.width = image.width
            cvs.height = image.height
            cvs.style.width = "0"
            cvs.style.height = "0"
        } catch (error) {
            console.error('Error loading image:', error)
        }
    }

    const processSerial = async (imagesArray) => {
        try {
            const firstImage = await cornerstone.loadImage("wadouri:" + imagesArray[0])

            setPatientInfo({
                fio: firstImage.data.string('x00100010'),
                date: formatDate(firstImage.data.string('x00080020')),
                birth: formatDate(firstImage.data.string('x00100030')),
                medcard_id: firstImage.data.string('x00100020')
            })

            // Отображаем первое изображение
            cornerstone.displayImage(divRef.current, firstImage)
            cornerstone.updateImage(divRef.current)

            // Обновляем canvas
            const cvs = cvsRef.current
            cvs.width = firstImage.width
            cvs.height = firstImage.height
            cvs.style.width = "0"
            cvs.style.height = "0"
        } catch (error) {
            console.error('Error processing serial images:', error)
        }
    }

    const generateNewRandomIds = (imagesLength) => {
        const randomArray = Array.from({ length: imagesLength }, () => Math.floor(Math.random() * 10 ** 10))
        return randomArray
    }

    useEffect(() => {
        if (imagePath.length === 1) {
            processDICOM(imagePath[0])
        } else if (imagePath.length > 1) {
            processSerial(imagePath)
        }
    }, [imagePath])

    // Устанавливаем imageIds один раз, если еще не установлены
    useEffect(() => {
        if (imagePath.length > 0 && imagesIds.length === 0) {
            setimagesIds(generateNewRandomIds(imagePath.length))
        }

    }, [imagePath, imagesIds])

    const handleReset = () => {
        setimagesIds(generateNewRandomIds(imagesIds.length))
    }

    // Функция для переключения изображений
    const handleSliderChange = (event) => {
        const newIndex = parseInt(event.target.value, 10)
        setCurrentImageIndex(newIndex)
    }

    const handleWheel = (event) => {
        if (wheelTimeoutRef.current) {
            clearTimeout(wheelTimeoutRef.current) // Очищаем предыдущий таймер
        }

        wheelTimeoutRef.current = setTimeout(() => {
            let newIndex = currentImageIndex
            if (event.deltaY < 0 && currentImageIndex > 0) {
                newIndex = currentImageIndex - 1
            } else if (event.deltaY > 0 && currentImageIndex < imagePath.length - 1) {
                newIndex = currentImageIndex + 1
            }

            if (newIndex !== currentImageIndex) {
                setCurrentImageIndex(newIndex)
            }
        }, 100) // задержка в 100мс, чтобы предотвратить быструю прокрутку
    }

    useEffect(() => {
        if (imagePath.length > 1) {
            cornerstone.loadImage("wadouri:" + imagePath[currentImageIndex]).then((image) => {
                cornerstone.displayImage(divRef.current, image)
                cornerstone.updateImage(divRef.current)
                const cvs = cvsRef.current
                cvs.width = image.width
                cvs.height = image.height
                cvs.style.width = "0"
                cvs.style.height = "0"

                setPatientInfo({
                    fio: image.data.string('x00100010'),
                    date: formatDate(image.data.string('x00080020')),
                    birth: formatDate(image.data.string('x00100030')),
                    medcard_id: image.data.string('x00100020')
                })
            }).catch((error) => {
                console.error('Error loading image:', error)
            })
        }
    }, [currentImageIndex, imagePath])

    return (
        <div
            className="Editor"
            style={{ display: "flex", flexDirection: "row" }}
            onWheel={handleWheel} // Добавляем обработчик колесика мыши
        >
            <div style={{ flex: 1 }}>
                <p>Изображений в серии: {imagePath.length}</p>
                <ImageViewer divRef={divRef} cvsRef={cvsRef} />
            </div>
            <div style={{ transform: 'rotate(90deg)' }}>
                <input
                    type="range"
                    min="0"
                    max={imagePath.length - 1}
                    value={currentImageIndex}
                    onChange={handleSliderChange}
                    style={{
                        width: "500px",      // Уменьшаем ширину слайдера
                        height: "80px",       // Уменьшаем высоту слайдера
                        background: "#ddd", // Устанавливаем цвет фона
                        borderRadius: "5px", // Скругляем края
                    }}
                />
            </div>

            <div style={{ marginLeft: "10px" }}>
                <ToolBox patientInfo={patientInfo} divRef={divRef} imageIds={imagesIds} currentImageIndex={currentImageIndex} key={currentImageIndex + imagesIds} onReset={handleReset} />
                <Saver divRef={divRef} needsave={needsave} />
            </div>
        </div>
    )
}

export default EditorWindow
