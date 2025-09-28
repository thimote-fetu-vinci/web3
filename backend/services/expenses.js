const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();
const EXPENSES_FILE_PATH = path.join(__dirname, '../data/expenses.json');
const EXPENSES_INIT_FILE_PATH = path.join(__dirname, '../data/expenses.init.json');

async function getAllExpenses() {
  return await prisma.expense.findMany();
}

async function addExpense(expense) {
  return await prisma.expense.create({
    data: expense
  });
}

function resetExpenses() {
  const initData = fs.readFileSync(EXPENSES_INIT_FILE_PATH, 'utf8');
  fs.writeFileSync(EXPENSES_FILE_PATH, initData);
  return JSON.parse(initData);
}

module.exports = {
  getAllExpenses,
  addExpense,
  resetExpenses,
};
