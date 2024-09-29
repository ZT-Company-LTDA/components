import { CalendarDate } from "@internationalized/date";

export const toZonedDateTime = (
  dateString: string | undefined
): CalendarDate | undefined => {
  if (!dateString) return undefined;

  try {
    // Converte a string para uma instância de Date
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // Mês é zero-indexado
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const millisecond = -10800000;
    const timeZone = "America/Sao_Paulo"; // Ajuste conforme necessário

    return new CalendarDate(year, month, day);
  } catch (error) {
    console.error("Erro ao converter data:", error);
    return undefined;
  }
};