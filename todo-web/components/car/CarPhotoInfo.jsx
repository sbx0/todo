import styles from './CarPhotoInfo.module.css';
import FormatTime from "../time/FormatTime";

export default ({
                    lotName,
                    carPlateNum,
                    floorName,
                    areaName,
                    parkNo,
                    imgUrl,
                    createTime,
                }) => {
    return <div className={styles.container}>
        <div className={styles.innerContainer}>
            <div className={styles.infoContainer}>
                <div>
                    <p>车位地址：</p>
                    <p>更新时间：</p>
                </div>

                <div className={styles.textRight}>
                    <p className={styles.bolder}>{parkNo}</p>
                    <p>
                        <FormatTime time={createTime}/>
                    </p>
                </div>
            </div>
            <div>
                <img className={styles.img} src={imgUrl}/>
            </div>
        </div>
    </div>
}