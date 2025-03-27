import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

export const exportWordDocx = () => {
  // 读取并获得模板文件的二进制内容
  function loadFile(url: string, callback: (error: any, content: any) => void) {
    PizZipUtils.getBinaryContent(url, callback);
  }

  // demo.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
  loadFile("meeting.docx", function (error: Error | null, content) {
    // 抛出异常
    if (error) {
      throw error;
    }
    console.log(content);

    // 创建一个JSZip实例，内容为模板的内容
    const zip: PizZip = new PizZip(content);
    const doc: Docxtemplater = new Docxtemplater().loadZip(
      zip
    ) as Docxtemplater;
    // 设置模板变量的值
    doc.setData({
      title: "John",
    });
    try {
      // 用模板变量的值替换所有模板变量
      doc.render();
    } catch (error: any) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
      // eslint-disable-next-line no-inner-declarations
      function replaceErrors(key: any, value: any) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function (
            error: any,
            key: string
          ) {
            error[key] = value[key as keyof Error];
            return error;
          },
          {});
        }
        return value;
      }
      console.log(
        JSON.stringify(
          {
            error: error,
          },
          replaceErrors
        )
      );

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function (error: any) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this : 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    // 将目标文件对象保存为目标类型的文件，并命名
    saveAs(out, "output.docx");
  });
};
