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

async function resetExpenses() {
  try {
    // Delete all existing expenses from the database
    await prisma.expense.deleteMany({});
    
    // Read initial data
    const initData = fs.readFileSync(EXPENSES_INIT_FILE_PATH, 'utf8');
    const expenses = JSON.parse(initData);
    
    // Insert initial data into the database (without IDs, let Prisma auto-generate them)
    const createdExpenses = await prisma.expense.createMany({
      data: expenses.map(expense => ({
        date: new Date(expense.date).toISOString(),
        description: expense.description,
        payer: expense.payer,
        amount: parseFloat(expense.amount)
      }))
    });
    
    // Get all expenses to return (createMany doesn't return the created records)
    const allExpenses = await prisma.expense.findMany();
    
    // Also update the JSON file for consistency
    fs.writeFileSync(EXPENSES_FILE_PATH, initData);
    
    return allExpenses;
  } catch (error) {
    console.error('Error resetting expenses:', error);
    throw error;
  }
}

module.exports = {
  getAllExpenses,
  addExpense,
  resetExpenses,
};
