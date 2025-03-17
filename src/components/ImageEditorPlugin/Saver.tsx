import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSavedImageUrl } from "@/stores/editorSlice"
// @ts-ignore
import cornerstone from "cornerstone-core"
import dicomParser from "dicom-parser"
// @ts-ignore
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"

cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

// @ts-ignore
const Saver = ({ divRef, needsave }) => {
    const dispatch = useDispatch()

    const SaveImage = async () => {
        const element = divRef.current

        if (!element) {
            console.error("divRef.current is null or undefined")
            return
        }

        if (!cornerstone.getEnabledElement(element)) {
            cornerstone.enable(element) // Включаем элемент, если он еще не включен
        }

        const enabledElement = cornerstone.getEnabledElement(element)

        if (!enabledElement) {
            console.error("Failed to enable element in Cornerstone.")
            return
        }

        const canvas = enabledElement.canvas

        // @ts-ignore
        canvas.toBlob((blob) => {
            if (blob) {
                const imageUrl = URL.createObjectURL(blob)
                dispatch(setSavedImageUrl(imageUrl)) // Сохраняем ссылку на изображение в Redux
            } else {
                console.error("Failed to create Blob from canvas.")
            }
        }, "image/png")
    }

    useEffect(() => {
        if (needsave) {
            SaveImage()
        }
    }, [needsave, divRef]) // Указываем зависимости

    return null // Компонент ничего не рендерит
}

export default Saver