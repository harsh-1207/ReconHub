const XLSX=require('xlsx'); const BaseParser=require('./BaseParser');
class ExcelParser extends BaseParser{supports(t){return ['xls','xlsx'].includes(t)} parse(buffer){const wb=XLSX.read(buffer,{type:'buffer',cellDates:true}); const out=[]; wb.SheetNames.forEach(name=>{const rows=XLSX.utils.sheet_to_json(wb.Sheets[name],{defval:null}); out.push(...rows)}); return out}}
module.exports=ExcelParser;
